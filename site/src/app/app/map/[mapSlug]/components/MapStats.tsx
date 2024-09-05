"use client";
import { useEffect, useState } from "react";
import { classNames } from "../../../../../../lib/functions/classNames";
import { useUserContext } from "@/app/app/components/UserContext";
import { useRouter } from "next/navigation";
import { secondsToDaysHours } from "../../../../../../lib/functions/secondsToDaysHours";
import { formatNumber } from "../../../../../../lib/functions/formatNumber";
import { secondsToHMS } from "../../../../../../lib/functions/secondsToHMS";
import { secondsToHours } from "date-fns";
import MapBanner from "./MapBanner";

interface MapSettingsProps {
  data: any;
}

export const MapStats = ({ data }: MapSettingsProps) => {
  const { token } = useUserContext();

  const [pageViews, setPageViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await fetch(`/api/get-stats?mapId=${data.mapId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch page views");
          return;
        }

        const result = await response.json();
        setPageViews(result?.results?.visitors?.value ?? 0);
      } catch (error) {
        console.error("Error fetching page views:", error);
      }
    };

    fetchPageViews();
  }, [data.mapId]);

  const stats = [
    {
      name: "Map Views",
      value: data.mapData.is_shared
        ? pageViews !== null
          ? formatNumber(pageViews)
          : ".."
        : "N/A",
      unit: "",
    },
    {
      name: "Total Activties",
      value: data.mapData.map_activities.length,
      unit: "",
    },
    {
      name: "Activity Sync",
      value: data.mapData.map_live_start_date ? "Enabled" : "N/A",
      unit: "",
    },
  ];
  if (!data) return null;
  return (
    <>
      {/* Stats */}
      {data.weatherToGet.length > 0 && <MapBanner />}
      <div className="grid grid-cols-3 bg-white">
        {stats.map((stat, statIdx) => (
          <div
            key={stat.name}
            className={classNames(
              statIdx % 2 === 1
                ? "sm:border-l"
                : statIdx === 2
                ? "lg:border-l"
                : "",
              "border-t border-white/5 px-4 py-3 lg:py-6 sm:px-6 lg:px-8"
            )}
          >
            <p className="text-xs lg:text-sm font-medium leading-6 text-gray-400">
              {stat.name}
            </p>
            <p className="lg:mt-2 flex items-baseline gap-x-1">
              <span className="text-lg md:text-4xl font-semibold tracking-tight ">
                {stat.value}
              </span>
              {stat.unit ? (
                <span className="text-sm text-gray-400 font-normal">
                  {stat.unit}
                </span>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
