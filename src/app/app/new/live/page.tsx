"use client";
import { use, useEffect, useRef, useState } from "react";
import { useUserContext } from "../../components/UserContext";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

import { CardHolder } from "../../components/CardHolder";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { TitleBlock } from "@/app/components/TitleBlock";
import { AppTitleBlock } from "../../components/AppTitleBlock";
import { UserMaxWidth } from "../../components/UserMaxWidth";
import { generateMapId } from "../lib/generateMapId";
import { DateRangePicker } from "@nextui-org/date-picker";
import {
  today,
  getLocalTimeZone,
  DateFormatter,
  toZoned,
} from "@internationalized/date";
import { Card, RangeCalendar, RangeValue } from "@nextui-org/react";

interface Activity {
  id: number;
  strava_id: number;
  activity_id: number;
  activity_data: any;
}

export default function ActivitiesTable() {
  const router = useRouter();
  const { userData, supabase, fetchMapData } = useUserContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const isDesktop = window.innerWidth > 1500;
  const [value, setValue] = useState<any>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [parsedDate, setParsedDate] = useState<{
    start: Date;
    end: Date;
  }>({
    start: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }).toDate(getLocalTimeZone()),
  });

  const handleDateChange = (range: any) => {
    const startDate = range.start.toDate(getLocalTimeZone());
    const endDate = range.end.toDate(getLocalTimeZone());

    setParsedDate({
      start: startDate,
      end: endDate,
    });
    setValue(range);
  };

  console.log(value);
  const createMap = async () => {
    setLoading(true);
    setLoadingMessage("Creating map...");
    const mapId = generateMapId();
    // Add one day to the end date to include the end date in the range
    parsedDate.end.setDate(parsedDate.end.getDate() + 1);
    const { error } = await supabase.from("exploremap_maps").insert({
      strava_id: userData.strava_id,
      unique_id: userData.unique_id,
      map_id: mapId,
      map_activities: [],
      map_live_start_date: parsedDate.start,
      map_live_end_date: parsedDate.end,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      fetchMapData();
      router.push(`/app/map/${mapId}`);
    }
  };

  return (
    <UserMaxWidth>
      <div className="h-screen flex flex-col justify-start pb-6 gap-4">
        <AppTitleBlock
          title="Select Activity Dates"
          description="Choose the dates of future activities you want to include in your map."
        />
        {loading ? (
          <>
            <div className="flex justify-center items-center h-full w-full py-12 flex-col">
              <LoadingSpinner />
              <p className="mt-4 text-gray-500">{loadingMessage}</p>
            </div>
          </>
        ) : (
          <>
            {error && (
              <CardHolder classNames="p-4 text-center">
                <div className="text-red-500">ERROR: {error}</div>
              </CardHolder>
            )}
            <div className="flex flex-col lg:flex-row gap-4 w-full relative">
              <div className="bg-gray-50 shadow rounded-lg w-full flex items-center justify-center">
                <RangeCalendar
                  aria-label="Date (Min Date Value)"
                  minValue={today(getLocalTimeZone())}
                  visibleMonths={isDesktop ? 3 : 1}
                  classNames={{
                    base: "shadow-none rounded-none border-none bg-none",
                    content: "bg-none",
                    gridHeader: "bg-none shadow-none",
                    headerWrapper: "bg-gray-50",
                    gridHeaderRow: "bg-gray-50",
                    grid: "bg-none",
                  }}
                  value={value}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={createMap}
                className="block rounded-md bg-blue-600 px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full"
              >
                <MapIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
                Create Map
              </button>
            </div>
          </>
        )}
      </div>
    </UserMaxWidth>
  );
}
