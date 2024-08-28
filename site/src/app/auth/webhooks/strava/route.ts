import { NextResponse } from "next/server";
import { getAccessToken, refreshStravaToken } from "../../lib/stravaUtils";
import { supabase } from "../../../../../lib/supabase/supabaseService";
import { updateMapsWithNewActivity } from "./updateMapsWithNewActivity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");

  const expectedToken = process.env.STRAVA_VERIFY_TOKEN || "";

  if (mode === "subscribe" && verifyToken === expectedToken) {
    console.log("Validation request received and verified");
    return NextResponse.json({ "hub.challenge": challenge }, { status: 200 });
  } else {
    console.log("Invalid verification token or mode");
    return NextResponse.json(
      { success: false, message: "Invalid verify token or mode" },
      { status: 403 }
    );
  }
}

export async function POST(request: Request) {
  const eventData = await request.json();
  const { object_type, aspect_type, object_id, owner_id, updates } = eventData;

  console.log(eventData);

  try {
    // Fetch the user's token data from the database
    const { data: userRecord, error: userError } = await supabase
      .from("exploremap_users")
      .select("*")
      .eq("strava_id", owner_id)
      .single();

    if (userError || !userRecord) {
      console.error("User not found for athlete ID:", owner_id);
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    let stravaTokenData = {
      access_token: userRecord.access_token,
      refresh_token: userRecord.refresh_token,
      expires_at: userRecord.expires_at,
    };

    // Check if the token has expired
    if (Date.now() / 1000 > stravaTokenData.expires_at) {
      console.log("Token expired, refreshing token for athlete ID:", owner_id);
      stravaTokenData = await refreshStravaToken(stravaTokenData.refresh_token);

      // Update the user's record with the new token information
      const { error: updateError } = await supabase
        .from("exploremap_users")
        .update({
          access_token: stravaTokenData.access_token,
          refresh_token: stravaTokenData.refresh_token,
          expires_at: stravaTokenData.expires_at,
        })
        .eq("strava_id", owner_id);

      if (updateError) {
        console.error(
          "Failed to update token information for athlete ID:",
          owner_id
        );
        return NextResponse.json({
          success: false,
          message: "Failed to update token information",
        });
      }
    }

    if (
      object_type === "activity" &&
      (aspect_type === "create" || aspect_type === "update")
    ) {
      const activityResponse = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?page=1&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${stravaTokenData.access_token}`,
          },
        }
      );

      const activityData = await activityResponse.json();

      const activityDataProcessed = activityData[0] ?? [];

      if (!activityResponse.ok) {
        throw new Error(
          `Failed to fetch activity details: ${activityData.message}`
        );
      }

      await supabase.from("exploremap_activities").upsert(
        {
          activity_id: activityDataProcessed.id,
          strava_id: owner_id,
          activity_data: activityDataProcessed, // Store the entire activity data object
        },
        {
          onConflict: "activity_id",
        }
      );

      // Extract activity start time and convert it to a Date object
      const activityStartTime = new Date(activityDataProcessed.start_date);

      // Call the function to update maps
      await updateMapsWithNewActivity(
        owner_id,
        activityDataProcessed.id,
        activityStartTime
      );

      console.log(`Activity ${aspect_type}d with ID: ${object_id}`);

      // Get the activity segment and weather data
      const { data: weatherData } = await supabase.functions.invoke(
        "fetch-weather-activities",
        {
          body: { activityIds: [activityDataProcessed.id] },
        }
      );

      const { data: fetchData } = await supabase.functions.invoke(
        "fetch-strava-activity",
        {
          body: {
            activityIds: [activityDataProcessed.id],
            stravaId: owner_id,
          },
        }
      );
      return NextResponse.json({
        success: true,
        message: `Activity ${aspect_type}d`,
      });
    } else if (object_type === "activity" && aspect_type === "delete") {
      const { error } = await supabase
        .from("exploremap_activities")
        .delete()
        .eq("activity_id", object_id);

      if (error) {
        throw new Error(`Failed to delete activity: ${error.message}`);
      }

      console.log(`Activity deleted with ID: ${object_id}`);
      return NextResponse.json({
        success: true,
        message: "Activity deleted",
      });
    } else if (object_type === "athlete" && aspect_type === "update") {
      if (updates?.authorized === "false") {
        const { error: deleteActivitiesError } = await supabase
          .from("exploremap_activities")
          .delete()
          .eq("strava_id", owner_id);

        if (deleteActivitiesError) {
          throw new Error(
            `Failed to delete user activities: ${deleteActivitiesError.message}`
          );
        }

        const { error: deleteMapsError } = await supabase
          .from("exploremap_maps")
          .delete()
          .eq("strava_id", owner_id);

        if (deleteMapsError) {
          throw new Error(
            `Failed to delete user activities: ${deleteMapsError.message}`
          );
        }

        // Handle deauthorization - delete user's data
        const { error: deleteUserError } = await supabase
          .from("exploremap_users")
          .delete()
          .eq("strava_id", owner_id);

        if (deleteUserError) {
          throw new Error(
            `Failed to delete user data: ${deleteUserError.message}`
          );
        }

        console.log(
          `User data deleted due to deauthorization for athlete ID: ${owner_id}`
        );
        return NextResponse.json({
          success: true,
          message: "User data deleted due to deauthorization",
        });
      } else {
        // Handle updates to athlete profile
        const athleteResponse = await fetch(
          `https://www.strava.com/api/v3/athletes/${owner_id}`,
          {
            headers: {
              Authorization: `Bearer ${stravaTokenData.access_token}`,
            },
          }
        );

        const athleteData = await athleteResponse.json();

        if (!athleteResponse.ok) {
          throw new Error(
            `Failed to fetch athlete details: ${athleteData.message}`
          );
        }

        await supabase
          .from("exploremap_users")
          .update({ athlete_info: athleteData })
          .eq("strava_id", owner_id);

        console.log(`Athlete info updated for athlete ID: ${owner_id}`);
        return NextResponse.json({
          success: true,
          message: "Athlete profile updated",
        });
      }
    }

    console.log("Unhandled event type");
    return NextResponse.json({
      success: true,
      message: "Unhandled event type",
    });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json({
      success: false,
      message: error || "An error occurred processing the webhook event",
    });
  }
}
