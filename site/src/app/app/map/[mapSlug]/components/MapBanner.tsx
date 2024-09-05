import { SunIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Banner() {
  const [showBanner, setShowBanner] = useState(true);
  if (!showBanner) return null;
  return (
    <>
      <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-blue-500 px-6 py-2.5 sm:py-3 sm:pl-8 sm:pr-3.5">
        <p className="text-sm leading-6 text-white flex items-center font-normal">
          <SunIcon
            aria-hidden="true"
            className="h-5 w-5 fill-current inline mr-2"
          />
          <strong className="font-semibold">Weather data is loading</strong>
          <span className="hidden lg:block">
            <svg
              viewBox="0 0 2 2"
              aria-hidden="true"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
            >
              <circle r={1} cx={1} cy={1} />
            </svg>
            Reload the map shortly and it will appear
          </span>
        </p>
        <button
          type="button"
          className="-m-3 flex-none p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon
            aria-hidden="true"
            className="h-5 w-5 text-white"
            onClick={() => setShowBanner(false)}
          />
        </button>
      </div>
    </>
  );
}
