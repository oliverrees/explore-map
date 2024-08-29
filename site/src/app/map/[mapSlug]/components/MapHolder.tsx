"use client";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("../../../components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  ),
});

interface MapHolderProps {
  data: any;
  isScreenshot?: boolean;
}

export const MapHolder = ({ data, isScreenshot }: MapHolderProps) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const height = document.documentElement?.clientHeight;
    setHeight(height);
  }, []);
  return (
    <div
      className="w-full"
      style={{
        height: `${height}px`,
      }}
    >
      <Map data={data} isPublic={true} isScreenshot={isScreenshot} />
    </div>
  );
};
