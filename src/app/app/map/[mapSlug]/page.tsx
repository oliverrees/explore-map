"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { MapSettings } from "./components/MapSettings";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

const Map = dynamic(() => import("../../../components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner />
    </div>
  ),
});

interface Activity {
  activity_data: any;
  activity_id: number;
  strava_id: number;
}

export default function MapPage() {
  const params = useParams();
  const mapSlug = params.mapSlug;
  const { supabase } = useUserContext();

  const [data, setData] = useState({
    mapData: null,
    allCoords: [],
    activityIds: [],
    totalDistance: 0,
    lastDistance: 0,
    activitiesData: [],
    totalTime: 0,
    totalElevationGain: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        setData({
          mapData,
          allCoords,
          activityIds,
          totalDistance,
          lastDistance: totalDistance, // Assuming the last distance is the total
          activitiesData: activitiesData,
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
  }, [mapSlug]);

  if (!data.mapData && !loading) {
    return (
      <div className="flex items-center justify-center h-full mt-24">
        Map not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen ">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <MapSettings data={data} />
          <div className="h-[50rem] pb-20 lg:pb-0 lg:h-full">
            <Map data={data} />
          </div>
        </>
      )}
    </div>
  );
}
