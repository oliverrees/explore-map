// lib/stravaUtils.ts

import { supabase } from "../../../../lib/supabase/supabaseService";

interface StravaTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
  };
}

export async function refreshStravaToken(refreshToken: string) {
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

export async function getStravaActivities(
  accessToken: string,
  fetchAll: boolean
) {
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

    if (!fetchAll || activities.length < perPage) {
      fetchMore = false;
    } else {
      page++;
    }
  }

  return allActivities;
}

export async function insertActivitiesInBatches(
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

export async function getAccessToken(athleteId: number): Promise<string> {
  const { data, error } = await supabase
    .from("exploremap_users")
    .select("access_token")
    .eq("strava_id", athleteId)
    .single();

  if (error || !data) {
    throw new Error("Failed to retrieve access token");
  }

  return data.access_token;
}
