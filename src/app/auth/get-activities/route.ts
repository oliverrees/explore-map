import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";
import { cookies } from "next/headers";
import { getSupabaseClient } from "../../../../lib/supabase/client";

interface StravaTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
  };
}

async function refreshStravaToken(refreshToken: string) {
  const body = new URLSearchParams();
  body.append("client_id", process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || "");
  body.append("client_secret", process.env.STRAVA_CLIENT_SECRET || "");
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", refreshToken);

  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: body,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }

  const data: StravaTokenData = await response.json();
  return data;
}

async function getStravaActivities(accessToken: string, fetchAll: boolean) {
  let allActivities: any = [];
  let page = 1;
  const perPage = 200;
  let fetchMore = true;

  while (fetchMore) {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Strava activities");
    }

    const activities = await response.json();
    allActivities = allActivities.concat(activities);

    // Stop fetching if fewer than expected activities are returned or if we're not fetching all
    if (!fetchAll || activities.length < perPage) {
      fetchMore = false;
    } else {
      page++;
    }
  }

  return allActivities;
}

async function insertActivitiesInBatches(
  activities: any[],
  userRecord: any,
  batchSize: number = 10
) {
  for (let i = 0; i < activities.length; i += batchSize) {
    const batch = activities.slice(i, i + batchSize);
    const inserts = batch.map((activity) => {
      const { id, ...activityDetails } = activity;
      return {
        strava_id: userRecord.strava_id,
        activity_id: id,
        activity_data: activityDetails,
      };
    });

    try {
      await supabase
        .from("exploremap_activities")
        .upsert(inserts, { onConflict: "activity_id" });
    } catch (e) {
      console.error("Error inserting activities batch:", e);
    }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.unique_id) {
      return NextResponse.json({
        success: false,
        message: "No ID provided",
      });
    }
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
