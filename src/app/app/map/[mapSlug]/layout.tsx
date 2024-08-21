"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { processMapData } from "@/app/components/map/lib/processMapData";
import { MapDataProvider } from "./components/MapDataContext";
import { MapHeader } from "./components/MapHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const mapSlug = params.mapSlug;
  const [height, setHeight] = useState(0);
  const { supabase } = useUserContext();
  useEffect(() => {
    const height = document.documentElement?.clientHeight;
    setHeight(height);
  }, []);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      if (!mapSlug) {
        return;
      }
      try {
        const { data: mapData, error: mapError } = await supabase
          .from("exploremap_maps")
          .select("*")
          .eq("slug", mapSlug)
          .single();

        if (mapError) throw new Error(mapError.message);

        const { data: activitiesData, error: activitiesError } = await supabase
          .from("exploremap_activities")
          .select("*")
          .in("activity_id", mapData.map_activities);

        if (activitiesError) throw new Error(activitiesError.message);

        const processedData = processMapData(mapData, activitiesData);
        setData(processedData);
      } catch (error) {
        console.error("Error loading map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [mapSlug]);

  return (
    <MapDataProvider data={data} loading={loading}>
      <div
        className="flex w-full flex-col h-full"
        style={{
          height: `${height}px`,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {Object.keys(data).length === 0 ? (
              <div className="flex items-center justify-center h-full mt-24">
                Map not found
              </div>
            ) : (
              <>
                <MapHeader />
                {children}
              </>
            )}
          </>
        )}
      </div>
    </MapDataProvider>
  );
}
