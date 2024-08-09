"use client";
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { ExploreLogo } from "./ExploreLogo"

const process = [
  {
    name: "Measure",
    description: "Measure your current state",
    href: "/measure",
    step: "1",
  },
  {
    name: "Discover",
    description: "Discover insights about yourself",
    href: "/discover",
    step: "2",
  },
  {
    name: "Change",
    description: "Experiment with interventions",
    href: "/change",
    step: "3",
  },
];
const callsToAction = [
  { name: "FAQs", href: "/#faqs", icon: QuestionMarkCircleIcon },
];
const company = [
  { name: "Our Story", href: "/about/story" },
  { name: "Contact", href: "/contact/" },
  // { name: "Careers", href: "/about/careers" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Header = ({
  darkMode,
  background,
  showBook = true,
}: {
  darkMode?: boolean;
  background?: string;
  showBook?: boolean;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const standardClasses = "relative z-20";
  const bgClasses = darkMode
    ? standardClasses + " text-white "
    : standardClasses + " text-black"
  return (
    <header className={bgClasses}>
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 ${bgClasses}`}
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <ExploreLogo />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 z-20 relative items-center">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 outline-none">
              How does it work?
              <ChevronDownIcon
                className={`h-5 w-5 flex-none ${bgClasses}`}
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-0 ring-white-900/5 ">
                <div className="p-4">
                  {process.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 text-black"
                    >
                      <div className="flex-none w-12 h-12 bg-obsidian text-xl text-white rounded-full flex items-center justify-center">
                        {item.step}
                      </div>
                      <div className="flex-auto">
                        <Link href={item.href} className="block font-semibold ">
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className=" text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-obsidian text-white">
                  {callsToAction.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6  hover:bg-lightBlack "
                    >
                      <item.icon
                        className={`h-5 w-5 flex-none ${bgClasses}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <Popover className="relative z-20 ">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 outline-none">
              About
              <ChevronDownIcon
                className={`h-5 w-5 flex-none ${bgClasses}`}
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-40 mt-3 w-56 rounded-xl bg-white text-black p-2 shadow-lg ring-1 ring-gray-900/5">
                {company.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6  hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </Popover.Panel>
            </Transition>
          </Popover>
          <Link href="/teams" className="text-sm font-semibold leading-6 ">
            For teams
          </Link>
          <Link href="/science" className="text-sm font-semibold leading-6 ">
            Science
          </Link>
          <Link href="/studio" className="text-sm font-semibold leading-6 ">
            Studio
          </Link>
          {showBook && (
            <Link
              href="/book"
              className={`text-sm font-semibold leading-6 ${
                darkMode ? "text-black bg-white" : "text-white bg-black"
              } 
            px-4 py-2 rounded-lg`}
            >
              Create your map
            </Link>
          )}
        </Popover.Group>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0" />
        <Dialog.Panel className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-black z-30 text-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 ">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between relative z-40">
                <Link href="/" className="-m-1.5 p-1.5 outline-none">
                  state<span className="font-semibold ">being</span>
                </Link>

                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Disclosure as="div" className="-mx-3">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7  hover:bg-white/20">
                            How does it work?
                            <ChevronDownIcon
                              className={classNames(
                                open ? "rotate-180" : "",
                                "h-5 w-5 flex-none"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2">
                            {[...process, ...callsToAction].map((item) => (
                              <Disclosure.Button
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7  hover:bg-white-20"
                              >
                                {item.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <Disclosure as="div" className="-mx-3">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7  hover:bg-white/20">
                            About
                            <ChevronDownIcon
                              className={classNames(
                                open ? "rotate-180" : "",
                                "h-5 w-5 flex-none"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2">
                            {company.map((item) => (
                              <Disclosure.Button
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-white/20"
                              >
                                {item.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Link
                      href="/teams"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      For teams
                    </Link>
                    <Link
                      href="/science"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      Science
                    </Link>
                    <Link
                      href="/studio"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      Studio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {showBook && (
                <Link
                  href="/book"
                  className="-mx-3 text-center block rounded-lg px-3 py-2 text-base font-semibold leading-7 bg-white text-black"
                >
                  Book Now
                </Link>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};
