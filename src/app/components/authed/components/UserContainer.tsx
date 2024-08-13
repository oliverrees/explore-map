import logo from "@/app/assets/img/logo.png";
import Image from "next/image";
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  MapIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "../../../../../lib/functions/classNames";
import { useUserContext } from "@/app/app/components/UserContext";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/app/home", icon: HomeIcon, count: 0, current: true },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export const UserContainer = () => {
  const { userData } = useUserContext();

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
                      item.current
                        ? "bg-gray-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                      "group cursor-pointer flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
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
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your maps
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <Link
                    href={team.href}
                    className={classNames(
                      team.current
                        ? "bg-gray-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <span
                      className={classNames(
                        team.current
                          ? "border-blue-600 text-blue-600"
                          : "border-gray-200 text-gray-400 group-hover:border-blue-600 group-hover:text-blue-600",
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                      )}
                    >
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
            >
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
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
