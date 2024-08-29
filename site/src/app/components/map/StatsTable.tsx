"use client";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { format, addDays, secondsToHours } from "date-fns";
import { secondsToHMS } from "../../../../lib/functions/secondsToHMS";
import { formatNumber } from "../../../../lib/functions/formatNumber";
interface Props {
  data: any;
  onChangeShowPins: (pinStatus: boolean) => void;
  showPins: boolean;
  showSatellite: boolean;
  onChangeShowSatellite: (satelliteStatus: boolean) => void;
  dark: boolean;
  onChangeDark: (darkStatus: boolean) => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const revalidate = 600;

const StatsTable = ({
  data,
  onChangeShowPins,
  showPins,
  onChangeShowSatellite,
  showSatellite,
  dark,
  onChangeDark,
}: Props) => {
  const [miles, setMiles] = useState(false);
  const [expandStats, setExpandStats] = useState(false);

  const stats = [
    {
      label: "Total distance",
      value: {
        km: formatNumber(data.totalDistance / 1000),
        miles: formatNumber((data.totalDistance / 1000) * 0.621371),
      },
      alwaysShow: false,
    },
    {
      label: "Total elevation",
      value: {
        km: formatNumber(data.totalElevationGain),
        miles: formatNumber(data.totalElevationGain * 3.28084),
      },
      alwaysShow: false,
    },
  ];

  return (
    <div
      className={`${
        dark ? "bg-black text-white" : "bg-gray-50 lg:bg-white text-gray-500"
      } lg:pb-2 lg:pt-3 lg:px-4 pt-1 lg:rounded-lg lg:shadow-lg`}
    >
      <div
        style={{
          display: expandStats ? "block" : "none",
        }}
      >
        <table className="w-full divide-y divide-gray-300 lg:flex">
          <tbody className="divide-y divide-gray-200 w-full lg:pb-3">
            {stats.map((stat) => (
              <tr
                key={stat.label}
                className={classNames(
                  !expandStats && !stat.alwaysShow && "hidden",
                  "flex justify-between "
                )}
              >
                <td className="px-4 py-3 text-xs md:text-sm font-medium capitalize">
                  {stat.label}
                </td>
                <td className="px-4 py-3 text-xs md:text-sm ">
                  {miles ? stat.value.miles : stat.value.km}
                  &nbsp;
                  {miles
                    ? stat.label == "Total elevation"
                      ? "ft"
                      : "miles"
                    : stat.label == "Total elevation"
                    ? "m"
                    : "km"}
                </td>
              </tr>
            ))}
            {expandStats && (
              <>
                <tr className="flex justify-between">
                  <td className="px-4 py-3 text-xs md:text-sm font-medium">
                    Total Time (hrs)
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm ">
                    {secondsToHours(data.totalTime)}
                  </td>
                </tr>
                <tr className="flex justify-between">
                  <td className="px-4 py-3 text-xs md:text-sm font-medium ">
                    Total Activities
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm ">
                    {data.totalActivities}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div
          style={{ pointerEvents: "all" }}
          className={`flex text-xs items-center lg:rounded-lg gap-2 justify-between px-4 lg:px-2 p-2 mt-2 lg:mt-0 lg:mx-2 mb-2 font-semibold 
            ${
              dark
                ? "bg-white/10 text-white"
                : "bg-gray-100 lg:bg-white text-black"
            }`}
        >
          <div>KM/Miles</div>
          <div>
            <UnitSwitch
              checkedStatus={miles}
              setCheckedStatus={setMiles}
              dark={dark}
            />
          </div>
        </div>
      </div>
      <div
        style={{ pointerEvents: "all" }}
        className={`py-2 pt-3 md:py-4 items-center ${
          dark ? "bg-black text-white" : "bg-gray-50 lg:bg-white text-black"
        } justify-center gap-y-2 text-center text-xs md:text-sm font-semibold grid grid-cols-4 px-4 lg:gap-x-4`}
      >
        <div>
          <UnitSwitch
            checkedStatus={expandStats}
            setCheckedStatus={setExpandStats}
            dark={dark}
          />
        </div>
        <div>
          <UnitSwitch
            checkedStatus={showSatellite}
            setCheckedStatus={onChangeShowSatellite}
            dark={dark}
          />
        </div>
        <div>
          <UnitSwitch
            checkedStatus={showPins}
            setCheckedStatus={onChangeShowPins}
            dark={dark}
          />
        </div>
        <div>
          <UnitSwitch
            checkedStatus={dark}
            setCheckedStatus={onChangeDark}
            dark={dark}
          />
        </div>
        <div>Stats</div>
        <div>Satellite</div>
        <div>Pins</div>
        <div>Dark</div>
      </div>
    </div>
  );
};

interface UnitSwitchProps {
  checkedStatus: boolean;
  setCheckedStatus: any;
  dark: boolean;
}

const UnitSwitch = ({
  checkedStatus,
  setCheckedStatus,
  dark,
}: UnitSwitchProps) => {
  return (
    <Switch
      checked={checkedStatus}
      onChange={setCheckedStatus}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
        ${dark ? "bg-white/20" : "bg-gray-200"}`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          checkedStatus ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
};

export default StatsTable;
