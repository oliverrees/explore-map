"use client";
import { classNames } from "../../../../../../lib/functions/classNames";
import { secondsToHMS } from "../../../../../../lib/functions/secondsToHMS";
import { useUserContext } from "@/app/app/components/UserContext";
import { useRouter } from "next/navigation";

interface MapSettingsProps {
  data: any;
}

export const MapStats = ({ data }: MapSettingsProps) => {
  const { supabase, fetchMapData } = useUserContext();
  const router = useRouter();
  const stats = [
    { name: "Activities", value: data.activityIds.length },
    {
      name: "Distance",
      value: (data.totalDistance / 1000).toFixed(2),
      unit: "km",
    },
    {
      name: "Time",
      value: secondsToHMS(data.totalTime),
    },
  ];

  return (
    <>
      {/* Stats */}
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
