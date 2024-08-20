import { differenceInDays, format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { InfoWindow } from "./InfoWindow";
// import Weather from "./Weather";

interface sidebarProps {
  activityData: any;
  open: boolean;
  setOpen: any;
  activityId: number;
}

export const revalidate = 600;
const infoNotes: any = {};

export default function Sidebar({
  open,
  setOpen,
  activityData,
  activityId,
}: sidebarProps) {
  const [weather, setWeather] = useState<any>(null);

  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => {
      setWeather(null);
    }, 500);
  };

  if (!activityData.start_date) {
    return null;
  }

  const stravaLink = `https://www.strava.com/activities/${activityId}`;

  // Define categories
  const timingStats = [
    {
      name: "Start Date",
      value: format(new Date(activityData.start_date), "dd/MM/yyyy"),
    },
    {
      name: "Moving Time",
      value: new Date(activityData.moving_time * 1000)
        .toISOString()
        .substr(11, 8),
    },
    {
      name: "Total Time",
      value: new Date(activityData.elapsed_time * 1000)
        .toISOString()
        .substr(11, 8),
    },
    {
      name: "Time Zone",
      value: activityData.timezone,
    },
  ];

  const performanceStats = [
    {
      name: "Distance Covered",
      value: (activityData.distance / 1000).toFixed(2),
      unit: "km",
    },
    {
      name: "Average Cadence",
      value: activityData.average_cadence,
      unit: "spm",
      runOnly: true,
    },
    {
      name: "Average Heart Rate",
      value: activityData.average_heartrate,
      unit: "bpm",
    },
    {
      name: "Average Power",
      value: activityData.average_watts,
      unit: "watts",
    },
    {
      name: "Average Speed",
      value: (activityData.average_speed * 3.6).toFixed(2),
      unit: "km/h",
    },
    {
      name: "Max Heart Rate",
      value: activityData.max_heartrate,
      unit: "bpm",
    },
    {
      name: "Max Speed",
      value: (activityData.max_speed * 3.6).toFixed(2),
      unit: "km/h",
    },
    {
      name: "Max Power",
      value: activityData.max_watts,
      unit: "watts",
    },
  ];

  const conditionStats = [
    {
      name: "Elevation High",
      value: activityData.elev_high,
      unit: "m",
    },
    {
      name: "Elevation Low",
      value: activityData.elev_low,
      unit: "m",
    },
    {
      name: "Elevation Gain",
      value: activityData.total_elevation_gain,
      unit: "m",
    },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeSidebar}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white p-8 pb-24">
                    <div className="space-y-6">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="font-semibold leading-6 text-3xl text-gray-900">
                              {activityData.name}
                            </h2>
                            <p className="mt-3 text-sm text-gray-500">
                              {format(
                                new Date(activityData.start_date),
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {infoNotes[activityData.activity_id] && (
                        <InfoWindow>
                          {infoNotes[activityData.activity_id].message}{" "}
                          <Link
                            href={infoNotes[activityData.activity_id].link}
                            target="new"
                            className="underline"
                          >
                            Read more here
                          </Link>
                        </InfoWindow>
                      )}

                      <h3 className="font-medium text-gray-900">Timing</h3>
                      <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {timingStats.map((stat, statIdx) => {
                          if (stat.value === null) {
                            return null;
                          }
                          return (
                            <div
                              className="flex justify-between py-3 text-sm font-medium"
                              key={statIdx}
                            >
                              <dt className="text-gray-500">{stat.name}</dt>
                              <dd className="text-gray-900">{stat.value}</dd>
                            </div>
                          );
                        })}
                      </dl>

                      <h3 className="font-medium text-gray-900">
                        Performance Metrics
                      </h3>
                      <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {performanceStats.map((stat, statIdx) => {
                          if (
                            (stat.runOnly && activityData.type !== "Run") ||
                            !stat.value
                          ) {
                            return null;
                          }
                          return (
                            <div
                              className="flex justify-between py-3 text-sm font-medium"
                              key={statIdx}
                            >
                              <dt className="text-gray-500">{stat.name}</dt>
                              <dd className="text-gray-900">
                                {stat.value} {stat.unit}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>

                      <h3 className="font-medium text-gray-900">Conditions</h3>
                      <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {conditionStats.map((stat, statIdx) => {
                          if (stat.value === null) {
                            return null;
                          }
                          return (
                            <div
                              className="flex justify-between py-3 text-sm font-medium"
                              key={statIdx}
                            >
                              <dt className="text-gray-500">{stat.name}</dt>
                              <dd className="text-gray-900">
                                {stat.value} {stat.unit && stat.unit}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>

                      {/* {weather && (
                        <Weather weather={weather} date={activityData.date} />
                      )} */}

                      <div className="absolute bottom-0 left-0 right-0 w-full">
                        <Link
                          href={stravaLink}
                          target="_blank"
                          className="w-full flex justify-center bg-orange-600 px-3 py-4 text-sm font-semibold text-white text-center"
                        >
                          View on Strava
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
