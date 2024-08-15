"use client";
import logo from "@/app/assets/img/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { HomeIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../../../../lib/functions/classNames";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const navigation = [
  { name: "Home", href: "/app/home", icon: HomeIcon, count: 0 },
];

export const UserContainer = () => {
  const { userData, mapData } = useUserContext();
  // get current url
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex pt-4 shrink-0 items-center">
        <Image alt="Explore Map Logo" src={logo} className="h-28 w-auto" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      currentPage === item.href.split("/").pop()
                        ? "bg-gray-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                      "group cursor-pointer flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        currentPage === item.href.split("/").pop()
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-600",
                        "h-6 w-6 shrink-0"
                      )}
                    />
                    {item.name}
                    {item.count ? (
                      <span
                        aria-hidden="true"
                        className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            {mapData.length > 0 && (
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Your maps
              </div>
            )}

            <ul role="list" className="-mx-2 mt-2 space-y-1 pb-6">
              {mapData.map((map: any) => (
                <li key={map.map_id}>
                  <Link
                    href={`/app/map/${map.map_id}`}
                    className={classNames(
                      currentPage === map.map_id
                        ? "bg-gray-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <span
                      className={classNames(
                        currentPage === map.map_id
                          ? "border-blue-600 text-blue-600"
                          : "border-gray-200 text-gray-400 group-hover:border-blue-600 group-hover:text-blue-600",
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                      )}
                    >
                      {map.map_id.charAt(0)}
                    </span>
                    <span className="truncate">{map.map_id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="-mx-6 mt-auto  bottom-0 bg-gray-50 w-auto overflow-hidden ">
            <Popover className="relative ">
              <PopoverButton className="w-full outline-none">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                  <img
                    alt="Your profile picture"
                    src={userData.athelete_info.profile_medium}
                    className="h-8 w-8 rounded-full bg-gray-50"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">
                    {userData.athelete_info.firstname}{" "}
                    {userData.athelete_info.lastname}{" "}
                  </span>
                </div>
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-black/5 rounded-xl text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 z-50 w-72 "
              >
                {/* <div className="p-3">
                  <a
                    className="block rounded-lg py-2 px-3 transition hover:bg-black/5"
                    href="#"
                  >
                    <p className="font-semibold text-black">Insights</p>
                    <p className="text-black/50">
                      Measure actions your users take
                    </p>
                  </a>
                </div> */}
                <div className="p-2">
                  <Link
                    className="block rounded-lg p-2 w-full bg-white border shadow transition hover:bg-black/10"
                    href="/auth/logout"
                  >
                    <p className="font-semibold text-black">Log Out</p>
                  </Link>
                </div>
              </PopoverPanel>
            </Popover>
          </li>
        </ul>
      </nav>
    </div>
  );
};
