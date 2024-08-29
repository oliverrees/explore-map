"use client";
import { format } from "date-fns";

type Props = {
  data: any;
  dark: boolean;
  showSatellite: boolean;
};

export const revalidate = 600;

const Stats = ({ data, showSatellite, dark }: Props) => {
  const isDark = dark || showSatellite;
  return (
    <div className="ml-4 lg:ml-10 mb-1 lg:mb-10 overflow-hidden pointer-events-none lg:rounded-lg lg:shadow-lg z-20 lg:max-w-lg w-full">
      <div
        className={`lg:pl-6 lg:pr-6  ${
          isDark
            ? "text-white lg:bg-black [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)] lg:[text-shadow:none]"
            : "lg:bg-white"
        }`}
      >
        <div className="text-2xl lg:text-3xl font-semibold lg:pt-4">
          {data.mapName}
        </div>
        <div className="mt-1 lg:mt-2 pb-2 lg:pb-4 font-light text-sm lg:text-lg">
          {format(data.startDate, "dd/MM/yy")} -{" "}
          {format(data.endDate, "dd/MM/yy")}
        </div>
        {/* <div className="pl-4 mt-2 mb-2 lg:mb-0 text-xs flex gap-x-4 pointer-events-auto">
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
    </div>
  );
};

export default Stats;
