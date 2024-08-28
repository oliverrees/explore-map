"use client";
import dynamic from "next/dynamic";
import { MapStats } from "./components/MapStats";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { useMapData } from "./components/MapDataContext";

const Map = dynamic(() => import("../../../components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner />
    </div>
  ),
});

export default function MapPage() {
  const { data } = useMapData();

  if (!data) return null;
  return (
    <>
      <MapStats data={data} />
      <div className="h-full pb-[4.5rem] relative lg:pb-0">
        <Map data={data} isPublic={false} />
      </div>
    </>
  );
}
