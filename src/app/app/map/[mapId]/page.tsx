"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { MapSettings } from "./components/MapSettings";
import { useUserContext } from "../../components/UserContext";

const Map = dynamic(() => import("../../components/map/Map"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
}

export default function MapPage() {
  const params = useParams();
  const mapId = params.mapId;
  const { supabase } = useUserContext();

  const [data, setData] = useState({
    allCoords: [],
    activityIds: [],
    totalDistance: 0,
    lastDistance: 0,
    rawData: [],
    totalTime: 0,
    totalElevationGain: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      if (!mapId) {
        return;
      }
      try {
        // Fetch the map activities from the exploremap_maps table
        const { data: mapData, error: mapError } = await supabase
          .from("exploremap_maps")
          .select("*")
          .eq("map_id", mapId)
          .single();

        if (mapError) throw new Error(mapError.message);

        const mapActivities = mapData.map_activities;

        // Fetch the activities details from the exploremap_activities table
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("exploremap_activities")
          .select("activity_data, activity_id")
          .in("id", mapActivities);

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

        setData({
          allCoords,
          activityIds,
          totalDistance,
          lastDistance: totalDistance, // Assuming the last distance is the total
          rawData: activitiesData,
          totalTime,
          totalElevationGain,
        });
      } catch (error) {
        console.error("Error loading map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [mapId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen">
      <MapSettings data={data} />
      <Map data={data} />
    </div>
  );
}
