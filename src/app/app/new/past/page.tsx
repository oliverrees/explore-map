"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import TableHeader from "../../components/activities/TableHeader";
import TableRow from "../../components/activities/TableRow";
import Pagination from "../../components/activities/Pagination";
import { CardHolder } from "../../components/CardHolder";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { TitleBlock } from "@/app/components/TitleBlock";
import { AppTitleBlock } from "../../components/AppTitleBlock";
import { UserMaxWidth } from "../../components/UserMaxWidth";
import { generateMapId } from "../lib/generateMapId";
import { ChooseName } from "../components/ChooseName";
import { ActivityTable } from "../../components/activities/ActivityTable";

export default function ActivitiesTable() {
  const router = useRouter();
  const { userData, supabase, fetchMapData } = useUserContext();
  const [chooseNameOpen, setChooseNameOpen] = useState<boolean>(false);
  const [selectedActivities, setActivities] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const createMap = async (name: string) => {
    setLoading(true);
    const mapId = generateMapId();

    // Insert the new map and return the slug
    const { data, error } = await supabase
      .from("exploremap_maps")
      .insert({
        strava_id: userData.strava_id,
        unique_id: userData.unique_id,
        map_id: mapId,
        map_activities: selectedActivities,
        map_name: name,
      })
      .select("slug")
      .single();

    if (error) {
      setLoading(false);
    } else {
      fetchMapData();
      const mapSlug = data.slug; // Get the slug from the inserted map
      router.push(`/app/map/${mapSlug}`); // Redirect to the slug-based URL
    }
  };

  return (
    <>
      <ChooseName
        isOpen={chooseNameOpen}
        onConfirm={(name) => {
          createMap(name);
          setChooseNameOpen(false);
        }}
        onCancel={() => setChooseNameOpen(false)}
      />
      <UserMaxWidth>
        {loading ? (
          <>
            <div className="flex justify-center items-center h-full w-full py-12 flex-col">
              <LoadingSpinner />
              <p className="mt-4 text-gray-500">Creating Map</p>
            </div>
          </>
        ) : (
          <div className="h-screen flex flex-col justify-between pb-6 gap-4">
            <AppTitleBlock
              title="Select Activities"
              description="Select the activities you want to include in your ExploreMap"
            />
            <ActivityTable
              onConfirm={(selectedActivities: number[]) => {
                setActivities(selectedActivities);
                setChooseNameOpen(true);
              }}
            />
          </div>
        )}
      </UserMaxWidth>
    </>
  );
}
