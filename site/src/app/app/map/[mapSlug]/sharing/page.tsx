"use client";
import { Field, Label, Description } from "@headlessui/react";
import { Switch } from "@nextui-org/react";
import { useMapData } from "../components/MapDataContext";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";

export default function MapPage() {
  const { data } = useMapData();
  const { supabase } = useUserContext();
  const [enabled, setEnabled] = useState(data.mapData.is_shared);
  if (!data) return null;

  const updateSharing = async (enabled: boolean) => {
    // Update the sharing status of the map
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .update({ is_shared: enabled })
      .eq("id", data.mapData.id);
    if (mapError) {
      console.error(mapError);
    } else {
    }
  };

  return (
    <div className="px-4 pb-6 sm:px-6 lg:px-8 bg-white pt-6 flex flex-col gap-6">
      <Field className="flex items-center justify-between">
        <span className="flex flex-grow flex-col pr-4">
          <Label
            as="span"
            passive
            className="text-base font-medium leading-6 text-gray-900"
          >
            Enable sharing
          </Label>
          <Description
            as="span"
            className="text-xs lg:text-base font-light text-gray-500 mt-1"
          >
            Allow people with a link to view your map
          </Description>
        </span>
        <Switch
          isSelected={enabled}
          onValueChange={(enabled: boolean) => {
            setEnabled(enabled);
            updateSharing(enabled);
          }}
        ></Switch>
      </Field>
      {enabled && (
        <Field className="flex flex-col lg:flex-row lg:items-center justify-between">
          <span className="flex flex-grow flex-col pr-4">
            <Label
              as="span"
              passive
              className="text-base font-medium leading-6 text-gray-900"
            >
              Your Link
            </Label>
            <Description
              as="span"
              className="text-xs lg:text-base font-light text-gray-500 mt-1"
            >
              Share this link with others so they can view your map.
            </Description>
          </span>
          <Link
            href={`https://exploremap.io/map/${data.mapData.slug}`}
            target="new"
            className="text-blue-500 mt-1 lg:mt-0"
          >
            https://exploremap.app/map/{data.mapData.slug}
          </Link>
        </Field>
      )}
    </div>
  );
}
