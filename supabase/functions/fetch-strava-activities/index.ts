import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("BASE_URL")!,
    Deno.env.get("BASE_SERVICE_ROLE_KEY")!
  );

  let taskId;

  // Define corsHeaders at the top level so it's accessible throughout the function
  const corsHeaders = {
    "Access-Control-Allow-Origin": "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
  };

  try {
    // Set the allowed origin based on the request origin
    const allowedOrigins = [
      "https://exploremap.io",
      "https://staging.exploremap.io",
    ];

    const origin = req.headers.get("Origin") || "";

    if (allowedOrigins.includes(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
    }

    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const { stravaId } = await req.json();
    console.log("Strava ID:", stravaId);

    // Check if a task with the same stravaId is already in progress
    const { data: existingTask, error: existingTaskError } = await supabase
      .from("exploremap_tasks")
      .select("id, status, updated_at")
      .eq("strava_id", stravaId)
      .eq("status", "in_progress")
      .single();

    if (existingTaskError && existingTaskError.code !== "PGRST116") {
      throw new Error("Error checking for existing task");
    }

    if (existingTask) {
      // Task is already in progress, return early to avoid multiple executions
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task already in progress",
        }),
        {
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    // Insert a new task record into the tasks table
    const { data: task, error: taskError } = await supabase
      .from("exploremap_tasks")
      .insert({
        strava_id: stravaId,
        status: "in_progress",
        data: null,
      })
      .select("id")
      .single();

    if (taskError || !task) {
      throw new Error("Failed to create task record");
    }

    taskId = task.id;

    // Fetch user record from the database
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

    // Refresh token if expired
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

    // Fetch and store activities page by page
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const activities = await getStravaActivities(
        stravaTokenData.access_token,
        page
      );

      await insertActivitiesInBatches(supabase, activities, userRecord);

      // If fewer activities were returned than the page limit, we're done
      if (activities.length < 200) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Update the task status to 'completed'
    await supabase
      .from("exploremap_tasks")
      .update({
        status: "completed",
        data: { message: "Activities fetched and stored" },
      })
      .eq("id", taskId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Activities fetched and stored",
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error:", error);

    // Update the task status to 'failed'
    if (taskId) {
      await supabase
        .from("exploremap_tasks")
        .update({ status: "failed", data: { message: error.message } })
        .eq("id", taskId);
    }

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

  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }

  return await response.json();
}

async function getStravaActivities(accessToken: string, page: number) {
  const perPage = 200;

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

  return await response.json();
}

async function insertActivitiesInBatches(
  supabase: any,
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
