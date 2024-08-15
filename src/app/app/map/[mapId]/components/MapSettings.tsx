"use client";
import { useEffect, useState } from "react";
import { classNames } from "../../../../../../lib/functions/classNames";
import { secondsToHMS } from "../../../../../../lib/functions/secondsToHMS";
import { format } from "date-fns";
import { useUserContext } from "@/app/app/components/UserContext";
import { useRouter } from "next/navigation";

const secondaryNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Activity", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
  { name: "Collaborators", href: "#", current: false },
  { name: "Notifications", href: "#", current: false },
];

interface MapSettingsProps {
  data: any;
}

export const MapSettings = ({ data }: MapSettingsProps) => {
  const { supabase, fetchMapData } = useUserContext();
  const router = useRouter();
  const stats = [
    { name: "Total Activities", value: data.activityIds.length },
    {
      name: "Total Distance",
      value: (data.totalDistance / 1000).toFixed(2),
      unit: "km",
    },
    {
      name: "Total Time",
      value: secondsToHMS(data.totalTime),
    },
    {
      name: "Total Elevation Gain",
      value: data.totalElevationGain.toFixed(2),
      unit: "m",
    },
  ];

  const deleteMap = async () => {
    // confirm box
    if (!confirm("Are you sure you want to delete this map?")) {
      return;
    }
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .delete()
      .eq("map_id", data.id);

    if (mapError) {
      console.error(mapError);
    } else {
      router.push("/app/home");
      fetchMapData();
      console.log(mapData);
    }
  };

  return (
    <main>
      <header>
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto border-b border-white/10 py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-black sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={item.current ? "text-blue-500" : ""}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Heading */}
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-x-3">
              <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <h1 className="flex gap-x-3 text-base leading-7">
                <span className="font-semibold ">Your Maps</span>
                <span className="text-gray-600">/</span>
                <span className="font-semibold ">{data.id}</span>
              </h1>
            </div>
            <p className="mt-2 text-xs leading-6 text-gray-400">
              Created on {format(data.created, "MMMM dd, yyyy")}
            </p>
          </div>
          <div className="flex gap-2">
            <div
              className="order-first cursor-pointer flex-none rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/30 sm:order-none"
              onClick={deleteMap}
            >
              Delete Map
            </div>
            <div className="order-first flex-none rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 sm:order-none">
              Share Map
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white">
          {stats.map((stat, statIdx) => (
            <div
              key={stat.name}
              className={classNames(
                statIdx % 2 === 1
                  ? "sm:border-l"
                  : statIdx === 2
                  ? "lg:border-l"
                  : "",
                "border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8"
              )}
            >
              <p className="text-sm font-medium leading-6 text-gray-400">
                {stat.name}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight ">
                  {stat.value}
                </span>
                {stat.unit ? (
                  <span className="text-sm text-gray-400">{stat.unit}</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </header>
    </main>
  );
};
