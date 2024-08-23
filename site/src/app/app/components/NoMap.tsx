import { PlusIcon } from "@heroicons/react/20/solid";
import map from "@/app/assets/img/map.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NoMap = () => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const height = document.documentElement?.clientHeight;
    setHeight(height);
  }, []);
  return (
    <div
      className="text-center flex flex-col items-center justify-center"
      style={{
        height: `${height}px`,
      }}
    >
      <Image src={map} alt="Terrain" className="px-4 lg:h-96 w-auto" />
      <h3 className="mt-2 text-2xl font-display font-semibold text-gray-900">
        Create an ExploreMap
      </h3>
      <p className="mt-3 text-sm font-medium text-gray-500">
        Build a new map in minutes
      </p>
      <div className="mt-6">
        <Link
          href="/app/new"
          type="Link"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
          New ExploreMap
        </Link>
      </div>
    </div>
  );
};
