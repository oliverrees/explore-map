import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";
import { fetchAndStorePhotos } from "../lib/fetchAndStorePhotos";

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
      .single();

    if (mapError) {
      return NextResponse.json({ error: "Map Error" }, { status: 500 });
    }

    // Check activity ID is in map
    if (!map?.map_activities.includes(activityId)) {
      return NextResponse.json(
        { error: "Activity not in map" },
        { status: 404 }
      );
    }

    // Fetch activity from Supabase
    let { data: activity, error } = await supabase
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

    // Calculate the start and end of the day for the activity's start_date
    const activityStartDate = new Date(activity.activity_data.start_date);
    const startOfDay = new Date(
      activityStartDate.getFullYear(),
      activityStartDate.getMonth(),
      activityStartDate.getDate(),
      0,
      0,
      0
    ).toISOString();
    const endOfDay = new Date(
      activityStartDate.getFullYear(),
      activityStartDate.getMonth(),
      activityStartDate.getDate(),
      23,
      59,
      59
    ).toISOString();

    // Check if photos need to be fetched and stored
    if (activity?.activity_data?.total_photo_count > 0 && !activity?.photos) {
      // Get photos and store them
      const photos = await fetchAndStorePhotos(activityId);

      // Update the activity object with the fetched photos
      activity.photos = photos;
    }

    // Build the return object, including photos if available
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
      photos: activity?.photos?.primary?.urls || null,
      tweets: null as any[] | null,
      youtube: null as any[] | null,
      activity_detail: activity?.activity_detail,
      weather: activity?.weather,
    };

    if (map.strava_id === "22704023") {
      // Fetch tweets that were created on the same day as the activity
      let { data: retrievedTweets, error: tweetError } = await supabase
        .from("exploremap_tweets")
        .select("*")
        .eq("strava_id", parseInt(map.strava_id))
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay);

      if (tweetError) {
        return NextResponse.json({ error: "Tweet Error" }, { status: 500 });
      }

      let { data: retrievedYoutube, error: youtubeError } = await supabase
        .from("exploremap_youtube")
        .select("*")
        .eq("stravaId", parseInt(map.strava_id))
        .gte("publishedAt", startOfDay)
        .lte("publishedAt", endOfDay);

      if (youtubeError) {
        return NextResponse.json({ error: "Youtube Error" }, { status: 500 });
      }

      returnObj.tweets = retrievedTweets;
      returnObj.youtube = retrievedYoutube as any[] | null;
    }

    return NextResponse.json(returnObj);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
