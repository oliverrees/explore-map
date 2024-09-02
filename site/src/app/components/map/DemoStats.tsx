import React, { useState, useEffect } from "react";
import activityInfo from "../../data/demoStats.json";
import { ActivityDetailChart } from "./ActivityDetailChart";
import grid from "../../assets/img/grid.png";

interface PerformanceMetricsProps {}

const DemoStats: React.FC<PerformanceMetricsProps> = () => {
  const performanceStats = [
    {
      name: "Average Heart Rate",
      value: activityInfo?.average_heartrate,
      unit: "bpm",
      chart: true,
      chartKey: "averageHeartrates",
      chartColor: "#f87171",
    },

    {
      name: "Average Speed",
      value: activityInfo?.average_speed
        ? (activityInfo?.average_speed * 3.6).toFixed(2)
        : null,
      unit: "km/h",
      chart: true,
      chartKey: "averageSpeeds",
      chartColor: "#60a5fa",
    },

    {
      name: "Elevation Gain",
      value: activityInfo?.total_elevation_gain,
      unit: "m",
      chart: true,
      chartKey: "totalElevationGains",
      chartColor: "#34d399",
    },
    {
      name: "Avg Temperature",
      value: activityInfo?.weather?.temperature_2m_mean,
      unit: "°C",
      chart: true,
      chartKey: "avgTemps",
      chartColor: "#34d399",
    },
  ];

  return (
    <div className="performance-metrics mx-4 -mb-16 lg:mb-0">
      <dl className="mt-2 grid grid-cols-2 rounded-lg shadow-lg relative">
        <div
          style={{
            backgroundImage: `url(${grid.src})`,
          }}
          className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
        />
        {performanceStats.map((stat, index) => {
          if (!stat.value) return null;
          return (
            <div key={index} className="flex flex-col overflow-hidden p-3">
              {" "}
              <div className="h-12 transform pt-1">
                <ActivityDetailChart
                  chartColor={stat.chartColor}
                  chartData={activityInfo.activity_detail}
                  chartKey={stat.chartKey}
                  activityId={index.toString()}
                />
              </div>
              <dt className="text-gray-500 text-xs font-normal mt-4">
                {stat.name}
              </dt>
              <dd className="text-gray-900">
                {stat.value} {stat.unit}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default DemoStats;
