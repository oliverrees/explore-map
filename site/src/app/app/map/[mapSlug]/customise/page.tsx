"use client";
import { Field, Label, Description } from "@headlessui/react";
import { Card, Input, Slider } from "@nextui-org/react";
import { useMapData } from "../components/MapDataContext";
import { useState } from "react";
import { useUserContext } from "@/app/app/components/UserContext";
import { useRouter } from "next/navigation";
import { UserMaxWidth } from "@/app/app/components/UserMaxWidth";
import { CardHolder } from "@/app/app/components/CardHolder";
import { PaintBrushIcon } from "@heroicons/react/24/outline";

export default function MapPage() {
  const { data, updateMapData } = useMapData();
  const router = useRouter();
  const { supabase, fetchMapData } = useUserContext();

  const [zoomLevel, setZoomLevel] = useState<number>(
    data.mapData.zoom_level ?? 0
  );
  const [centerLat, setCenterLat] = useState<string>(
    data.mapData?.center_lat_lng?.[0] ?? null
  );
  const [centerLon, setCenterLon] = useState<string>(
    data.mapData?.center_lat_lng?.[1] ?? null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  if (!data) return null;

  const saveSettings = async () => {
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .update({
        zoom_level: zoomLevel,
        center_lat_lng: centerLat && centerLon ? [centerLat, centerLon] : null,
      })
      .eq("id", data.mapData.id)
      .select("slug")
      .single();

    if (mapError) {
      setLoading(false);
      console.error(mapError);
    } else {
      fetchMapData();
      updateMapData(data.slug);
      router.push(`/app/map/${mapData.slug}`);
    }
  };

  return (
    <>
      <UserMaxWidth>
        <CardHolder classNames="px-4 pb-6 sm:px-6 lg:px-8 bg-white pt-6 lg:mt-6">
          <Field className="flex items-start gap-4 justify-between flex-col">
            <span className="flex flex-grow flex-col pr-4">
              <Label
                as="span"
                passive
                className="text-base font-medium leading-6 text-gray-900"
              >
                Default Zoom Level
              </Label>
              <Description
                as="span"
                className="text-xs lg:text-base font-light text-gray-500 mt-1"
              >
                Change the default zoom level for this map. A lower number is
                more zoomed out.
              </Description>
            </span>
            <Slider
              label="Zoom Level"
              value={zoomLevel}
              maxValue={20}
              minValue={1}
              step={1}
              onChange={(value) => {
                if (typeof value === "number") {
                  setZoomLevel(value);
                }
              }}
              classNames={{
                label: "text-sm font-medium text-gray-900",
              }}
            />
          </Field>
        </CardHolder>
        <CardHolder classNames="px-4 pb-6 sm:px-6 lg:px-8 bg-white pt-6 lg:mt-6">
          <Field className="flex items-center gap-4 justify-between flex-col lg:flex-row">
            <span className="flex flex-grow flex-col pr-4">
              <Label
                as="span"
                passive
                className="text-base font-medium leading-6 text-gray-900"
              >
                Default Center Coordinates
              </Label>
              <Description
                as="span"
                className="text-xs lg:text-base font-light text-gray-500 mt-1"
              >
                Change the center point of the map.
              </Description>
            </span>
            <div className="flex flex-row gap-4">
              <Input
                label="Latitude"
                type="number"
                onChange={(e) => setCenterLat(e.target.value)}
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-medium text-gray-900",
                  input: "border-none focus:ring-0",
                }}
                value={centerLat}
              />
              <Input
                label="Longitude"
                type="number"
                value={centerLon}
                onChange={(e) => setCenterLon(e.target.value)}
                labelPlacement="outside"
                classNames={{
                  label: "text-sm font-medium text-gray-900",
                  input: "border-none focus:ring-0",
                }}
              />
            </div>
          </Field>
        </CardHolder>
        <button
          onClick={saveSettings}
          type="button"
          className="block rounded-md bg-blue-600 mt-4 px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full"
        >
          <PaintBrushIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
          Save Changes
        </button>
      </UserMaxWidth>
    </>
  );
}
