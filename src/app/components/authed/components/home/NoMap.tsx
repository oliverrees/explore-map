import { PlusIcon } from "@heroicons/react/20/solid";
import map from "@/app/assets/img/map.png";
import Image from "next/image";
import Link from "next/link";

export const NoMap = () => {
  return (
    <div className="text-center h-screen flex flex-col items-center justify-center">
      <Image src={map} alt="Terrain" className="h-96 w-auto" />
      <h3 className="mt-2 text-2xl font-display font-semibold text-gray-900">
        Get Started
      </h3>
      <p className="mt-3 text-sm font-medium text-gray-500">
        Create your first ExploreMap in minutes
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
