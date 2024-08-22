"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MapIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@nextui-org/react";

interface ChooseNameProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  initialName?: string;
}

export const ChooseName = ({
  isOpen,
  onConfirm,
  onCancel,
  initialName = "",
}: ChooseNameProps) => {
  const [input, setInput] = useState(initialName);
  const canSubmit = input !== "" && input.length > 3;
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <MapIcon aria-hidden="true" className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold font-display leading-6 text-gray-900"
                >
                  Name Your Map
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-normal">
                    Enter a name for your map. The name must be at least 4
                    characters long. Don&apos;t worry, you can change this
                    later.
                  </p>
                  <Input
                    placeholder="Map Name"
                    className="mt-4"
                    value={input}
                    maxLength={50}
                    onChange={(e) => setInput(e.target.value)}
                    classNames={{
                      input:
                        "border-none outline-none focus:ring-0 text-md pl-0",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => onConfirm(input)}
                disabled={!canSubmit}
                style={{
                  cursor: !canSubmit ? "not-allowed" : "pointer",
                  opacity: !canSubmit ? 0.5 : 1,
                }}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Create Map
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
