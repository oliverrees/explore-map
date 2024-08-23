import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMapData } from "./MapDataContext";
import { format } from "date-fns";

interface MapHeaderProps {}

export const MapHeader = ({}: MapHeaderProps) => {
  const { data } = useMapData();
  const baseUrl = `/app/map/${data.slug}`;
  const secondaryNavigation = [
    { name: "Overview", href: baseUrl },
    {
      name: "Sharing",
      href: `${baseUrl}/sharing`,
      description: "Configure sharing settings for this map",
    },
    {
      name: "Activities",
      href: `${baseUrl}/activities`,
      description: "Choose which activities are on this map",
    },
    {
      name: "Live",
      href: `${baseUrl}/live`,
      description: "Change the live status of this map",
    },
    {
      name: "Manage",
      href: `${baseUrl}/manage`,
      description: "Manage the map's details and settings",
    },
  ];
  const pathname = usePathname();
  const currentPage = secondaryNavigation.find(
    (item) => item.href === pathname
  );

  return (
    <div className="border-b shadow-sm pb-2 bg-white relative z-10">
      <nav className="flex overflow-x-auto pb-4 lg:py-4 mt-16 lg:mt-0 ">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-black sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={pathname === item.href ? "text-blue-500" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 pb-2 lg:py-4 sm:flex-row sm:px-6 lg:px-8 ">
        <div>
          <div className="flex items-center gap-x-3">
            {/* <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div> */}
            <h1 className="flex gap-x-3 text-lg lg:text-2xl leading-7">
              <span className="font-semibold ">
                {currentPage?.name === "Overview"
                  ? data.mapName
                  : currentPage?.name}
              </span>
            </h1>
          </div>
          <p className="lg:mt-1 text-sm lg:text-base leading-6 text-gray-400 font-light">
            {currentPage?.name === "Overview" ? (
              <>Created on {format(data.createdAt, "MMMM dd, yyyy")}</>
            ) : (
              currentPage?.description
            )}
          </p>
        </div>
        <div className="flex gap-2 absolute right-3 lg:relative">
          {/* <div
                className="order-first cursor-pointer flex-none rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/30 sm:order-none"
                onClick={deleteMap}
              >
                Delete Map
              </div> */}
          {/* <div className="order-first cursor-pointer flex-none rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 sm:order-none">
            Share Map
          </div> */}
        </div>
      </div>
    </div>
  );
};
