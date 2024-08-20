import polyline from "@mapbox/polyline";
import { supabase } from "../../../../lib/supabase/supabaseService";
import { MapHolder } from "./components/MapHolder";

interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
}

export default async function Page({
  params,
}: {
  params: { mapSlug: string };
}) {
  const mapSlug = params.mapSlug;
  if (!mapSlug) {
    return (
      <div className="flex items-center justify-center h-full mt-24">
        Map not found
      </div>
    );
  }

  const fetchMapData = async () => {
    if (!mapSlug) {
      return;
    }
    try {
      // Fetch the map activities from the exploremap_maps table
      const { data: mapData, error: mapError } = await supabase
        .from("exploremap_maps")
        .select("*")
        .eq("slug", mapSlug)
        .eq("is_shared", true)
        .single();

      if (mapError) throw new Error(mapError.message);

      const mapActivities = mapData.map_activities;

      // Fetch the activities details from the exploremap_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("exploremap_activities")
        .select("*")
        .in("activity_id", mapActivities);

      if (activitiesError) throw new Error(activitiesError.message);

      // Process the activities to extract coordinates and other details
      const allCoords = activitiesData.map((activity: Activity) => {
        const coords = polyline.decode(
          activity.activity_data.map?.summary_polyline || ""
        );
        return { coords };
      });

      const activityIds = activitiesData.map(
        (activity: Activity) => activity.activity_id
      );

      // Calculate total distance (you can implement this if needed)
      const totalDistance = activitiesData.reduce(
        (total: any, activity: Activity) =>
          total + (activity.activity_data.distance || 0),
        0
      );

      // Calculate total moving time
      const totalTime = activitiesData.reduce(
        (total: any, activity: Activity) =>
          total + (activity.activity_data.elapsed_time || 0),
        0
      );

      // Calculate total elevation gain
      const totalElevationGain = activitiesData.reduce(
        (total: any, activity: Activity) =>
          total + (activity.activity_data.total_elevation_gain || 0),
        0
      );
      return {
        mapData,
        allCoords,
        activityIds,
        totalDistance,
        totalTime,
        totalElevationGain,
        activitiesData,
      };
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  const mapData = await fetchMapData();

  if (!mapData) {
    return <div>Error</div>;
  }

  return <MapHolder data={mapData} />;
}
