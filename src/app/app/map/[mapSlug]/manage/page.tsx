"use client";
import { Field, Label, Description } from "@headlessui/react";
import { Switch } from "@nextui-org/react";
import { useMapData } from "../components/MapDataContext";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChooseName } from "@/app/app/new/components/ChooseName";

export default function MapPage() {
  const { data, updateMapData } = useMapData();
  const router = useRouter();
  const { supabase, fetchMapData } = useUserContext();
  const [chooseNameOpen, setChooseNameOpen] = useState<boolean>(false);
  if (!data) return null;

  const deleteMap = async () => {
    // confirm box
    if (!confirm("Are you sure you want to delete this map?")) {
      return;
    }
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .delete()
      .eq("id", data.mapData.id);

    if (mapError) {
      console.error(mapError);
    } else {
      router.push("/app/home");
      fetchMapData();
      console.log(mapData);
    }
  };

  const updateMapName = async (name: string) => {
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .update({ map_name: name })
      .eq("id", data.mapData.id)
      .select("slug")
      .single();

    if (mapError) {
      console.error(mapError);
    } else {
      fetchMapData();
      updateMapData(data.slug);
      console.log(mapData);
      router.push(`/app/map/${mapData.slug}/manage`);
    }
  };

  return (
    <>
      <ChooseName
        isOpen={chooseNameOpen}
        initialName={data.mapData.map_name}
        onConfirm={(name) => {
          updateMapName(name);
          setChooseNameOpen(false);
        }}
        onCancel={() => setChooseNameOpen(false)}
      />
      <div className="px-4 pb-6 sm:px-6 lg:px-8 bg-white pt-6 flex flex-col gap-6">
        <Field className="flex items-center justify-between">
          <span className="flex flex-grow flex-col pr-4">
            <Label
              as="span"
              passive
              className="text-base font-medium leading-6 text-gray-900"
            >
              Delete Map
            </Label>
            <Description
              as="span"
              className="text-xs lg:text-base font-light text-gray-500 mt-1"
            >
              Once you delete a map, it cannot be recovered.
            </Description>
          </span>
          <button
            onClick={deleteMap}
            className="text-red-500 font-medium text-sm lg:text-base border px-4 py-2 border-red-500 rounded"
          >
            Delete Map
          </button>
        </Field>
        <Field className="flex items-center justify-between">
          <span className="flex flex-grow flex-col pr-4">
            <Label
              as="span"
              passive
              className="text-base font-medium leading-6 text-gray-900"
            >
              Rename Map
            </Label>
            <Description
              as="span"
              className="text-xs lg:text-base font-light text-gray-500 mt-1"
            >
              Change the name of this map.
            </Description>
          </span>
          <button
            onClick={() => setChooseNameOpen(true)}
            className="text-blue-500 font-medium text-sm lg:text-base border px-4 py-2 border-blue-500 rounded"
          >
            Rename Map
          </button>
        </Field>
      </div>
    </>
  );
}
