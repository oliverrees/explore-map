import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin !== "https://exploremap.io" &&
    origin !== "https://staging.exploremap.io"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { activityId, mapId } = body;
    if (typeof activityId !== "number" || typeof mapId !== "string") {
      return NextResponse.json({ error: "No Id" }, { status: 400 });
    }

    // Get map
    const { data: map, error: mapError } = await supabase
      .from("exploremap_maps")
      .select("*")
      .eq("map_id", mapId)
      .eq("is_shared", true)
      .single();

    if (mapError) {
      return NextResponse.json({ error: "Map Error" }, { status: 500 });
    }

    // Check activty id is in map
    if (!map?.map_activities.includes(activityId)) {
      return NextResponse.json(
        { error: "Activity not in map" },
        { status: 404 }
      );
    }

    // Fetch activity from Supabase
    const { data: activity, error } = await supabase
      .from("exploremap_activities")
      .select("*")
      .eq("activity_id", activityId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }

    if (!activity) {
      return NextResponse.json({ error: "Error" }, { status: 404 });
    }

    const returnObj = {
      name: activity?.activity_data?.name,
      start_date: activity?.activity_data?.start_date,
      moving_time: activity?.activity_data?.moving_time,
      elapsed_time: activity?.activity_data?.elapsed_time,
      timezone: activity?.activity_data?.timezone,
      distance: activity?.activity_data?.distance,
      average_cadence: activity?.activity_data?.average_cadence,
      average_heartrate: activity?.activity_data?.average_heartrate,
      average_watts: activity?.activity_data?.average_watts,
      average_speed: activity?.activity_data?.average_speed,
      max_heartrate: activity?.activity_data?.max_heartrate,
      max_speed: activity?.activity_data?.max_speed,
      max_watts: activity?.activity_data?.max_watts,
      elev_high: activity?.activity_data?.elev_high,
      elev_low: activity?.activity_data?.elev_low,
      total_elevation_gain: activity?.activity_data?.total_elevation_gain,
      id: activity.activity_id,
      type: activity?.activity_data?.type,
    };

    return NextResponse.json(returnObj);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
