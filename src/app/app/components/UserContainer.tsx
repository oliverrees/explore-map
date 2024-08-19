"use client";
import grid from "../../assets/img/grid.png";
import logo from "@/app/assets/img/logo.png";
import Image from "next/image";

import { Suspense, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "../../../../lib/functions/classNames";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const navigation = [
  { name: "Home", href: "/app/home", icon: HomeIcon, count: 0 },
];
const userNavigation = [
  // { name: "Your profile", href: "#" },
  { name: "Sign out", href: "/auth/logout" },
];

export const UserContainer = ({ children }: { children: React.ReactNode }) => {
  const { userData, mapData } = useUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex pt-4 shrink-0 items-center">
                  <Image
                    alt="Explore Map Logo"
                    src={logo}
                    className="h-12 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                currentPage === item.href.split("/").pop()
                                  ? "bg-blue-700 text-white"
                                  : "text-blue-200 hover:bg-blue-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  currentPage === item.href.split("/").pop()
                                    ? "text-white"
                                    : "text-blue-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0"
                                )}
                              />
                              {item.name}
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
                              onClick={() => setSidebarOpen(false)}
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
                    {/* <li className="mt-auto">
                      <Link
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-blue-200 group-hover:text-white"
                        />
                        Settings
                      </Link>
                    </li> */}
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white shadow-lg px-6 pb-4">
            <div className="flex pt-4 shrink-0 items-center">
              <Image
                alt="Explore Map Logo"
                src={logo}
                className="h-28 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={classNames(
                            currentPage === item.href.split("/").pop()
                              ? "bg-blue-700 text-white"
                              : "text-blue-700 hover:bg-blue-700 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              currentPage === item.href.split("/").pop()
                                ? "text-white"
                                : "text-blue-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                          {item.name}
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
                          onClick={() => setSidebarOpen(false)}
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
                <li className="mt-auto">
                  <Menu as="div" className="relative">
                    <MenuItems
                      transition
                      className="absolute bottom-16 -left-2 z-10 mt-2.5 w-64 origin-bottom-left rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={item.href}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <Image
                        alt=""
                        src={userData.athelete_info.profile_medium}
                        height={32}
                        width={32}
                        className="rounded-full bg-gray-50"
                      />
                      <div className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        >
                          {userData.athelete_info.firstname}&nbsp;
                          {userData.athelete_info.lastname}
                        </span>
                        <ChevronUpIcon
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 text-gray-400"
                        />
                      </div>
                    </MenuButton>
                  </Menu>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72 flex flex-col w-full relative overflow-auto ">
          <div className="fixed md:sticky w-full bg-white shadow-sm md:shadow-none border-b top-0 z-40 flex h-16 shrink-0 items-center gap-x-4  px-4 sm:gap-x-6 sm:px-6 lg:px-8 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            {/* <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            /> */}

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
              <div className="w-full h-full" />
              {/* <form action="#" method="GET" className="relative flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
              </form> */}
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button> */}

                {/* Separator */}
                {/* <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                /> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt=""
                      src={userData.athelete_info.profile_medium}
                      height={32}
                      width={32}
                      className="rounded-full bg-gray-50"
                    />
                    <div className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      >
                        {userData.athelete_info.firstname}&nbsp;
                        {userData.athelete_info.lastname}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </div>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          onClick={() => setSidebarOpen(false)}
                          href={item.href}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <div
            className="fixed top-0 left-0 -z-10 w-full h-full "
            style={{
              backgroundImage: `url(${grid.src})`,
              backgroundRepeat: "repeat",
            }}
          />

          <div className="h-full">{children}</div>
        </div>
      </div>
    </>
  );
};
