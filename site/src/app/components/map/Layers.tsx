import { Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { getColorFromValue } from "./lib/getColorFromValue";

type Props = {
  selectedLayer: string;
  setSelectedLayer: (layer: string) => void;
  minMaxValues: Record<string, [number, number]>;
};

export const Layers = ({
  selectedLayer,
  setSelectedLayer,
  minMaxValues,
}: Props) => {
  const layers = [
    { key: "averageSpeed", label: "Average Speed", unit: "km/h" },
    { key: "totalElevationGain", label: "Elevation Gain", unit: "m" },
    { key: "averageHeartrate", label: "Average Heart Rate", unit: "bpm" },
    { key: "maxHeartrate", label: "Max Heart Rate", unit: "bpm" },
    { key: "avgTemp", label: "Temperature", unit: "°C" },
    { key: "rainSum", label: "Rainfall", unit: "mm" },
    { key: "windSpeed", label: "Wind Speed", unit: "m/s" },
    { key: "None", label: "None", unit: "" },
  ];

  const minValue = minMaxValues[selectedLayer][0] ?? null;
  const maxValue = minMaxValues[selectedLayer][1] ?? null;

  const gradientColors = Array.from({ length: 100 }, (_, i) => {
    const value = minValue + (i / 99) * (maxValue - minValue);
    return getColorFromValue(value, minValue, maxValue, selectedLayer);
  });

  const filteredLayers = layers.filter((layer) => {
    return minMaxValues[layer.key]?.[0] != Infinity;
  });

  return (
    <>
      <div className="absolute top-3.5 z-50 left-16 right-5 h-14 lg:right-0 lg:left-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg flex gap-4">
          <Select
            label="Colour Layer"
            placeholder="Select data layer"
            className="max-w-xs mb-2 shadow-lg"
            classNames={{
              label: "text-sm font-medium text-gray-900",
              trigger: "bg-gray-50",
            }}
            value={selectedLayer}
            selectedKeys={[selectedLayer]}
            onChange={(e) => {
              setSelectedLayer(e.target.value);
            }}
          >
            {filteredLayers.map((layer) => (
              <SelectItem key={layer.key} value={layer.key}>
                {layer.label}
              </SelectItem>
            ))}
          </Select>

          {selectedLayer != "None" && (
            <div className="shadow-lg w-full bg-gray-50 rounded-xl p-2">
              <div className="flex justify-between text-xs text-gray-600 items-center mt-0.5">
                <span>{minValue.toFixed(2)}</span>
                <span>
                  {layers.find((layer) => layer.key === selectedLayer)?.unit}
                </span>
                <span>{maxValue.toFixed(2)}</span>
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
