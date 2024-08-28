import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("BASE_URL")!,
    Deno.env.get("BASE_SERVICE_ROLE_KEY")!
  );

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
  };

  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const { activityIds, stravaId } = await req.json();

    if (!activityIds || !stravaId || !Array.isArray(activityIds)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing or invalid required parameters: activityIds or stravaId",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const { data: userRecord, error: userError } = await supabase
      .from("exploremap_users")
      .select("*")
      .eq("strava_id", stravaId)
      .single();

    if (userError || !userRecord) {
      throw new Error("User not found");
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

    for (const activityId of activityIds) {
      const { data: existingActivity, error: activityError } = await supabase
        .from("exploremap_activities")
        .select("activity_detail")
        .eq("activity_id", activityId)
        .single();

      if (activityError) {
        console.error(`Error fetching activity ${activityId}:`, activityError);
        continue;
      }

      let activityDetail;

      if (!existingActivity.activity_detail) {
        const lapsData = await getStravaActivity(
          stravaTokenData.access_token,
          activityId
        );

        const distances = lapsData.map((lap: any) => lap.distance);
        const averageSpeeds = lapsData.map((lap: any) => lap.average_speed);
        const totalElevationGains = lapsData.map((lap: any) => lap.total_elevation_gain);
        const averageHeartrates = lapsData.map((lap: any) => lap.average_heartrate);
        const maxHeartrates = lapsData.map((lap: any) => lap.max_heartrate);
        const averageCadence = lapsData.map((lap: any) => lap.average_cadence);
        const averageWatts = lapsData.map((lap: any) => lap.average_watts);

        activityDetail = {
          distances,
          averageSpeeds,
          averageCadence,
          totalElevationGains,
          averageHeartrates,
          maxHeartrates,
          averageWatts
        };

        await supabase
          .from("exploremap_activities")
          .update({ activity_detail: activityDetail })
          .eq("activity_id", activityId);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Activity details retrieved successfully",
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});

async function refreshStravaToken(refreshToken: string) {
  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: Deno.env.get("STRAVA_CLIENT_ID")!,
      client_secret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error("Strava token refresh failed:", responseData);
    throw new Error("Failed to refresh Strava token");
  }

  return responseData;
}

async function getStravaActivity(accessToken: string, activityId: string) {
  const response = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}/laps`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Strava activity ${activityId}`);
  }

  return await response.json();
}
