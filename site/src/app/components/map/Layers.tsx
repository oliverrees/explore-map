import { Select, SelectItem } from "@nextui-org/react";
import React, { SetStateAction } from "react";
import { getColorFromValue } from "./lib/getColorFromValue";

type Props = {
  selectedLayer: any;
  setSelectedLayer: any;
  minMaxValues: Record<string, [number, number]>;
  dark?: boolean;
  isSegments?: boolean;
};
export const Layers = ({
  selectedLayer,
  setSelectedLayer,
  minMaxValues,
  dark,
  isSegments,
}: Props) => {
  const layers = [
    { key: "averageSpeed", label: "Avg Speed", unit: "km/h" },
    { key: "elevationGain", label: "Elevation", unit: "m" },
    { key: "averageHeartrate", label: "Avg Heart Rate", unit: "bpm" },
    { key: "maxHeartrate", label: "Max Heart Rate", unit: "bpm" },
    { key: "avgTemp", label: "Temperature", unit: "°C" },
    { key: "rainSum", label: "Rainfall", unit: "mm" },
    { key: "windSpeed", label: "Wind Speed", unit: "m/s" },
    { key: "None", label: "None", unit: "" },
  ];

  const handleSelectionChange = (e: any) => {
    setSelectedLayer(e.target.value);
  };

  const remapping: any = {
    averageSpeed: "averageSpeeds",
    elevationGain: "totalElevationGains",
    averageHeartrate: "averageHeartrates",
    averageCadence: "averageCadence",
    maxHeartrate: "maxHeartrates",
    averageWatts: "averageWatts",
    avgTemp: "avgTemp",
    rainSum: "rainSum",
    windSpeed: "windSpeed",
  };

  const minValue = !isSegments
    ? minMaxValues[selectedLayer]?.[0] ?? null
    : minMaxValues[remapping[selectedLayer]]?.[0] ?? null;
  const maxValue = !isSegments
    ? minMaxValues[selectedLayer]?.[1] ?? null
    : minMaxValues[remapping[selectedLayer]]?.[1] ?? null;

  const gradientColors = Array.from({ length: 100 }, (_, i) => {
    const value = minValue + (i / 99) * (maxValue - minValue);
    return getColorFromValue(value, minValue, maxValue, selectedLayer);
  });

  const filteredLayers = layers.filter((layer) => {
    return minMaxValues[layer.key]?.[0] != Infinity;
  });

  return (
    <>
      <div
        className={`absolute top-3.5 z-50 left-16 right-5 h-14 lg:right-0 lg:left-0 flex justify-center pointer-events-none ${
          dark ? "dark" : ""
        }`}
      >
        <div className="pointer-events-auto w-full max-w-lg flex gap-4">
          <Select
            label="Colour Layer"
            placeholder="Select data layer"
            className="max-w-xs mb-2 shadow-lg"
            classNames={{
              label: "text-sm font-medium text-gray-900",
              trigger: dark ? "" : "bg-gray-50",
            }}
            value={selectedLayer}
            selectedKeys={[selectedLayer]}
            onChange={handleSelectionChange}
          >
            {filteredLayers.map((layer) => (
              <SelectItem key={layer.key} value={layer.key}>
                {layer.label}
              </SelectItem>
            ))}
          </Select>

          {selectedLayer != "None" && (
            <div
              className={`shadow-lg w-full ${
                dark ? "bg-default-100 text-white" : "bg-gray-50 text-gray-600"
              } rounded-xl p-2`}
            >
              <div className="flex justify-between text-xs  items-center mt-0.5">
                <span>{minValue?.toFixed(2)}</span>
                <span>
                  {layers.find((layer) => layer.key === selectedLayer)?.unit}
                </span>
                <span>{maxValue?.toFixed(2)}</span>
              </div>
              <div
                className="h-4 mt-1 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${gradientColors.join(
                    ", "
                  )})`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
