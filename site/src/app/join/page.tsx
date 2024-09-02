"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import grid from "../assets/img/grid.png";
import isoBig from "../assets/img/map.png";
import Image from "next/image";

// Initialize Supabase client (replace these placeholders with your actual keys)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function WaitList() {
  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<any>({
    title: "",
    message: "",
    icon: null,
  });

  const handleSignUp = async (event: any) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from("exploremap_waitlist")
      .insert([{ email }]);

    if (error) {
      setDialogContent({
        title: "Error signing up",
        message: "Please try again later.",
        icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
      });
    } else {
      setDialogContent({
        title: "Thank you for signing up!",
        message: "You will be notified when we launch more widely.",
        icon: <CheckIcon className="h-6 w-6 text-green-600" />,
      });
    }
    setDialogOpen(true);
    setEmail(""); // Clear input after submission
  };

  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${grid.src})`,
        }}
        className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
      />
      <Container customPadding="px-6 lg:px-0 font-light">
        <div className="bg-white py-0 sm:py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-50 px-6 py-6 shadow-2xl rounded-3xl sm:px-12 xl:py-16">
              <Image src={isoBig} alt={""} className="mb-4 w-48 mx-auto" />
              <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-black sm:text-3xl font-display">
                Start Map Making
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-center text-md  text-black">
                We are currently in private beta and are only accepting a
                limited number of users. Sign up to join the waitlist and be
                notified when we are ready to launch more widely.
              </p>
              <form
                className="mx-auto mt-10 flex flex-col lg:flex-row max-w-md gap-x-4"
                onSubmit={handleSignUp}
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="min-w-0 flex-auto rounded-md border bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex-none rounded-md px-3.5 py-2.5 text-sm font-semibold mt-4 lg:mt-0 text-white shadow-sm hover:bg-blue-400 bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Join the waitlist
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>

      {/* Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                {dialogContent.icon}
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {dialogContent.title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-normal">
                    {dialogContent.message}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
