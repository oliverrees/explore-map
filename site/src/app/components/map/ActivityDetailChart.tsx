import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useEffect, useState } from "react";

interface ActivityDetailChartProps {
  chartData: any;
  chartKey: string;
  chartColor: string;
  activityId: string;
}

export const ActivityDetailChart = ({
  chartData,
  chartKey,
  chartColor,
  activityId,
}: ActivityDetailChartProps) => {
  const chartDataRun = chartData.distances.map((_: any, index: number) => ({
    name: `Segment ${index + 1}`,
    distance: chartData.distances?.[index],
    averageSpeeds: chartData.averageSpeeds?.[index],
    averageWatts: chartData.averageWatts?.[index],
    maxHeartrates: chartData.maxHeartrates?.[index],
    averageCadence: chartData.averageCadence?.[index],
    averageHeartrates: chartData.averageHeartrates?.[index],
    totalElevationGains: chartData.totalElevationGains?.[index],
  }));

  // Calculate min and max values for the selected chartKey
  const dataValues = chartDataRun.map((entry: any) => entry[chartKey]);
  const yAxisMin = Math.min(...dataValues);
  const yAxisMax = Math.max(...dataValues);

  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <LineChart data={chartDataRun} key={activityId}>
        <YAxis domain={[yAxisMin, yAxisMax]} hide={true} />
        <Line
          type="monotone"
          dataKey={chartKey}
          dot={false}
          stroke={chartColor}
          fill={chartColor}
          strokeWidth={3}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
