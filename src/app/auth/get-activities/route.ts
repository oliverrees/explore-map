// pages/api/get-activities.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import {
  refreshStravaToken,
  getStravaActivities,
  insertActivitiesInBatches,
} from "../lib/stravaUtils";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const token = cookies().get("token")?.value || null;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const supabase = getSupabaseClient(token);
    const forceReload = data.forceReload === true;
    const { data: userRecord, error: userError } = await supabase
      .from("exploremap_users")
      .select("*")
      .single();

    if (userError || !userRecord) {
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

    if (Date.now() / 1000 > stravaTokenData.expires_at) {
      stravaTokenData = await refreshStravaToken(stravaTokenData.refresh_token);

      await supabase
        .from("exploremap_users")
        .update({
          access_token: stravaTokenData.access_token,
          refresh_token: stravaTokenData.refresh_token,
          expires_at: stravaTokenData.expires_at,
        })
        .eq("strava_id", userRecord.strava_id);
    }

    const { data: existingActivities } = await supabase
      .from("exploremap_activities")
      .select("activity_id")
      .eq("strava_id", userRecord.strava_id);

    const fetchAll = forceReload || existingActivities?.length === 0;
    const activities = await getStravaActivities(
      stravaTokenData.access_token,
      fetchAll
    );

    await insertActivitiesInBatches(activities, userRecord);

    const { data: updatedActivities, error: activitiesError } = await supabase
      .from("exploremap_activities")
      .select("*")
      .eq("strava_id", userRecord.strava_id);

    if (activitiesError) {
      throw new Error("Failed to fetch updated activities");
    }

    return NextResponse.json({
      success: true,
      message: "Activities fetched and stored",
      activities: updatedActivities,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
