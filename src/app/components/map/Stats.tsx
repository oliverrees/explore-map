"use client";
import { differenceInDays, addDays, format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatsTable from "./StatsTable";

type Props = {
  data: any;
  onChangeShowPins: (pinStatus: boolean) => void;
  onChangeShowSatellite: (satelliteStatus: boolean) => void;
  showSatellite: boolean;
  showPins: boolean;
};

export const revalidate = 600;

const Stats = ({
  data,
  onChangeShowPins,
  showPins,
  showSatellite,
  onChangeShowSatellite,
}: Props) => {
  const [timeSinceStart, setTimeSinceStart] = useState("..");
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1;
    const day = currentDate.getUTCDate();
    const timeSinceStart = differenceInDays(
      new Date(year, month, day),
      new Date(2023, 4, 23)
    );
    setTimeSinceStart(`Day ${timeSinceStart}`);
  }, []);

  return (
    <div className="fixed bottom-0 md:bottom-10 left-0 right-0 md:right-10 md:left-auto overflow-hidden pointer-events-none shadow-lg md:rounded-lg z-20 md:max-w-md w-full">
      <div
        className={`md:bg-white ${
          showSatellite &&
          "text-white md:text-black [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)] md:[text-shadow:none]"
        }`}
      >
        <div className="text-xl md:text-2xl font-semibold pl-4 py-4 lg:bg-gray-50">
          {data.mapName}
        </div>
        {/* <div className="pl-4 pt-2 font-semibold text-sm">350 Days</div> */}
        {/* <div className="pl-4 mt-2 mb-2 md:mb-0 text-xs flex gap-x-4 pointer-events-auto">
          <Link
            target="_blank"
            className="border-b"
            href="https://www.strava.com/athletes/22704023"
          >
            Strava
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://www.patreon.com/HardestGeezer"
          >
            Patreon
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://www.youtube.com/@hardestgeezer"
          >
            Youtube
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://twitter.com/hardestgeezer"
          >
            Twitter
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://github.com/oliverrees/whereisruss"
          >
            Github
          </Link>
        </div> */}
      </div>
      <StatsTable
        data={data}
        showPins={showPins}
        onChangeShowPins={onChangeShowPins}
        showSatellite={showSatellite}
        onChangeShowSatellite={onChangeShowSatellite}
      />
    </div>
  );
};

export default Stats;
