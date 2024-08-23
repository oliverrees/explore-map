"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { CardHolder } from "../../components/CardHolder";
import { AppTitleBlock } from "../../components/AppTitleBlock";
import { UserMaxWidth } from "../../components/UserMaxWidth";
import { generateMapId } from "../lib/generateMapId";
import { today, getLocalTimeZone } from "@internationalized/date";
import { LiveActivitySelector } from "../../components/activities/LiveActivitySelector";
import { ChooseName } from "../components/ChooseName";
import { MapIcon } from "@heroicons/react/24/outline";

export default function LivePage() {
  const router = useRouter();
  const { userData, supabase, fetchMapData } = useUserContext();
  const [chooseNameOpen, setChooseNameOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [parsedDate, setParsedDate] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }).toDate(getLocalTimeZone()),
  });

  const createMap = async (name: string) => {
    setLoading(true);
    setLoadingMessage("Creating map...");
    const mapId = generateMapId();

    // Add one day to the end date to include the end date in the range
    // parsedDate.end.setDate(parsedDate.end.getDate() + 1);

    // Insert the new map and return the slug
    const { data, error } = await supabase
      .from("exploremap_maps")
      .insert({
        strava_id: userData.strava_id,
        unique_id: userData.unique_id,
        map_id: mapId,
        map_activities: [],
        map_live_start_date: parsedDate.start,
        map_live_end_date: parsedDate.end,
        map_name: name,
      })
      .select("slug")
      .single();

    if (error) {
      setError(error.message);
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
        <div className="h-screen flex flex-col justify-start pb-6 gap-4">
          <AppTitleBlock
            title="Select Activity Dates"
            description="Choose the dates of future activities you want to include in your map."
          />
          {loading ? (
            <div className="flex justify-center items-center h-full w-full py-12 flex-col">
              <LoadingSpinner />
              <p className="mt-4 text-gray-500">{loadingMessage}</p>
            </div>
          ) : (
            <>
              {error && (
                <CardHolder classNames="p-4 text-center">
                  <div className="text-red-500">ERROR: {error}</div>
                </CardHolder>
              )}
              <LiveActivitySelector
                onUpdate={(range: { start: Date | null; end: Date | null }) => {
                  setParsedDate(range);
                  setChooseNameOpen(true);
                }}
              />
            </>
          )}
        </div>
      </UserMaxWidth>
    </>
  );
}
