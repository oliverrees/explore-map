import { supabase } from "../../../../../lib/supabase/supabaseService";

export async function updateMapsWithNewActivity(
  stravaId: string,
  activityId: string,
  activityStartTime: Date
) {
  // Fetch all maps owned by the user
  const { data: maps, error: mapsError } = await supabase
    .from("exploremap_maps")
    .select("*")
    .eq("strava_id", stravaId);

  if (mapsError) {
    console.error("Error fetching maps for strava_id:", stravaId, mapsError);
    return;
  }

  const promises = maps.map(async (map) => {
    // Convert the map_live_start_date and map_live_end_date strings to Date objects
    const mapStartDate = new Date(map.map_live_start_date);
    const mapEndDate = new Date(map.map_live_end_date);
    console.log(
      "Checking to see if activity is within map date range of map:",
      map.id
    );

    // Check if the activity start time is within the map's live date range
    if (activityStartTime >= mapStartDate && activityStartTime <= mapEndDate) {
      // Only add to array if it doesn't already exist
      const updatedActivities = map.map_activities.includes(activityId)
        ? map.map_activities
        : [...map.map_activities, activityId];

      console.log(
        `Activity ${activityId} is within the date range of map ${map.id}, inserting`
      );

      const { error: updateError } = await supabase
        .from("exploremap_maps")
        .update({ map_activities: updatedActivities })
        .eq("id", map.id);

      if (updateError) {
        console.error("Error updating map with new activity:", updateError);
      } else {
        console.log(`Activity ${activityId} added to map ${map.id}`);

        // Get the activity segment and weather data
        const { data: weatherData } = await supabase.functions.invoke(
          "fetch-weather-activities",
          {
            body: { activityIds: [activityId] },
          }
        );

        const { data: activityData } = await supabase.functions.invoke(
          "fetch-strava-activity",
          {
            body: {
              activityIds: [activityId],
              stravaId: stravaId,
            },
          }
        );
      }
    } else {
      console.log(
        `Activity ${activityId} is not within the date range of map ${map.id}`
      );
    }
  });

  await Promise.all(promises);
}
