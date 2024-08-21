"use client";
import { useMapData } from "../components/MapDataContext";
import { useState } from "react";
import { useUserContext } from "@/app/app/components/UserContext";
import { useRouter } from "next/navigation";
import { today, getLocalTimeZone } from "@internationalized/date";
import { LiveActivitySelector } from "@/app/app/components/activities/LiveActivitySelector";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function MapPage() {
  const { data, updateMapData } = useMapData();
  const router = useRouter();
  const { supabase } = useUserContext();
  const [loading, setLoading] = useState(false);
  if (!data) return null;

  const saveLive = async (range: { start: Date | null; end: Date | null }) => {
    // Update the sharing status of the map
    setLoading(true);
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .update({
        map_live_start_date: range.start,
        map_live_end_date: range.end,
      })
      .eq("id", data.mapData.id);
    if (mapError) {
      console.error(mapError);
    } else {
      updateMapData(data.mapData.slug);
      router.push(`/app/map/${data.mapData.slug}`);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl w-full mx-auto
    h-full overflow-hidden"
    >
      <div className="h-full flex flex-col">
        <LiveActivitySelector
          initialDates={{
            start: data?.mapData.map_live_start_date,
            end: data.mapData.map_live_end_date,
          }}
          onUpdate={(range: { start: Date | null; end: Date | null }) => {
            saveLive(range);
          }}
          ctaText="Update Live Range"
          showCancel={
            data.mapData.map_live_start_date && data.mapData.map_live_end_date
          }
        />
      </div>
    </div>
  );
}
