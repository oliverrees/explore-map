import { supabase } from "../../../../lib/supabase/supabaseService";
import { refreshStravaToken } from "../../auth/lib/stravaUtils";

export async function fetchAndStorePhotos(activityId: number) {
  console.log("Fetching and storing photos for activity:", activityId);
  try {
    // Fetch the activity record to get the strava_id
    const { data: activityRecord, error: activityError } = await supabase
      .from("exploremap_activities")
      .select("strava_id")
      .eq("activity_id", activityId)
      .single();

    if (activityError || !activityRecord) {
      throw new Error("Activity not found");
    }

    const { strava_id } = activityRecord;

    // Fetch the user's token data
    const { data: userRecord, error: userError } = await supabase
      .from("exploremap_users")
      .select("access_token, refresh_token, expires_at")
      .eq("strava_id", strava_id)
      .single();

    if (userError || !userRecord) {
      throw new Error("User not found");
    }

    let { access_token, refresh_token, expires_at } = userRecord;

    // Check if the token is expired and refresh it if necessary
    if (Date.now() / 1000 > expires_at) {
      const refreshedToken = await refreshStravaToken(refresh_token);
      access_token = refreshedToken.access_token;
      refresh_token = refreshedToken.refresh_token;
      expires_at = refreshedToken.expires_at;

      // Update the user record with the new token data
      await supabase
        .from("exploremap_users")
        .update({ access_token, refresh_token, expires_at })
        .eq("strava_id", strava_id);
    }

    // Fetch the activity details from the Strava API
    const stravaResponse = await fetch(
      `https://www.strava.com/api/v3/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!stravaResponse.ok) {
      throw new Error("Failed to fetch activity from Strava");
    }

    const activityData = await stravaResponse.json();

    // Extract photos from the activity data
    const photos = activityData.photos || null;

    // Update the exploremap_activities table with the photos data
    const { error: updateError } = await supabase
      .from("exploremap_activities")
      .update({ photos })
      .eq("activity_id", activityId);

    if (updateError) {
      throw new Error("Failed to update photos in the database");
    }

    return photos;
  } catch (error) {
    console.error("Error fetching and storing photos:", error);
    throw new Error("Failed to fetch and store photos");
  }
}
