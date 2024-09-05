"use client";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  data: any;
  dark: boolean;
  showSatellite: boolean;
};

export const revalidate = 600;

const Stats = ({ data, showSatellite, dark }: Props) => {
  console.log(data);
  const isDark = dark || showSatellite;
  return (
    <div className="pl-4 lg:pl-0 lg:ml-10 mb-1 lg:mb-10 overflow-hidden pointer-events-none lg:rounded-lg lg:shadow-lg z-20 lg:max-w-lg">
      <div
        className={`lg:pl-6 lg:pr-6 pb-4  ${
          isDark
            ? "text-white lg:bg-black [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)] lg:[text-shadow:none]"
            : "lg:bg-white"
        }`}
      >
        <div className="text-2xl lg:text-3xl font-semibold lg:pt-4">
          {data.mapName}
        </div>
        <div className="mt-1 lg:mt-2  font-light text-sm lg:text-lg">
          {format(data.startDate, "dd/MM/yy")} -{" "}
          {format(data.endDate, "dd/MM/yy")}
        </div>
        {data.links && (
          <div className="text-sm flex gap-x-4 pointer-events-auto pt-2 font-semibold">
            {data.links.map((link: any) => (
              <Link
                key={link.title}
                href={link.url}
                className="border-b"
                target="_blank"
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
