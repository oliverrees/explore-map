"use client";
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { ExploreLogo } from "./ExploreLogo";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Header = ({ darkMode }: { darkMode?: boolean }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const standardClasses = "relative z-20";
  const bgClasses = darkMode
    ? standardClasses + " text-white "
    : standardClasses + " text-black";
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
        <div className="lg:flex hidden gap-8">
          <Link
            href="/about/terms"
            className="text-sm font-semibold leading-6 "
          >
            Terms
          </Link>
          <Link
            href="/about/privacy"
            className="text-sm font-semibold leading-6 "
          >
            Privacy
          </Link>
          <Link
            href="/about/contact"
            className="text-sm font-semibold leading-6 "
          >
            Contact Us
          </Link>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0" />
        <Dialog.Panel className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white z-30 text-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 ">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between relative z-40">
                <Link href="/" className="-m-1.5 p-1.5 outline-none">
                  <ExploreLogo />
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
                    <Link
                      href="/about/privacy"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/about/terms"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      Terms
                    </Link>
                    <Link
                      href="/about/contact"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-white/20"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};
