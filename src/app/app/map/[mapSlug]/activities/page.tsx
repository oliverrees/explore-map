"use client";
import { Field, Label, Description } from "@headlessui/react";
import { Switch } from "@nextui-org/react";
import { useMapData } from "../components/MapDataContext";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";
import { ActivityTable } from "@/app/app/components/activities/ActivityTable";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function MapPage() {
  const { data, updateMapData } = useMapData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { supabase } = useUserContext();
  const [selectedActivities, setSelectedActivities] = useState<number[]>(
    data.mapData.map_activities
  );
  if (!data) return null;

  const saveActivities = async (activities: number[]) => {
    // Update the sharing status of the map
    setLoading(true);
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .update({ map_activities: activities })
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
        <ActivityTable
          ctaText="Update Activities"
          onConfirm={(selectedActivitiesNew: number[]) => {
            setSelectedActivities(selectedActivities);
            saveActivities(selectedActivitiesNew);
          }}
          initialSelectedActivities={selectedActivities}
        />
      </div>
    </div>
  );
}
