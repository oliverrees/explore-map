import Link from "next/link";
import { LinkButton } from "./LinkButton";
import { getStravaAuthUrl } from "../../../lib/auth/functions/getStravaAuthUrl";
import Image from "next/image";
import stravaConnect from "../assets/img/connect.svg";

export function SignUp() {
  return (
    <section className="relative bg-gray-50 overflow-hidden bg-obsidian py-20 sm:py-28">
      <div className="mx-auto max-w-md text-center flex justify-center items-center flex-col">
        <h2 className="text-2xl font-semibold font-display tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg  mb-6 mx-4 font-normal">
          Sign up to start creating your own maps and share your adventures with
          friends and supporters.
        </p>
        {/* <Link
          href={"/join"}
          className="w-full lg:w-auto rounded-md bg-blue-600 px-3 py-2 lg:px-6 lg:py-3 text-center text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Join the waitlist
        </Link> */}
        <Link
          href={getStravaAuthUrl()}
          className="w-auto bg-[#FC4C02] flex justify-center"
        >
          <Image src={stravaConnect} alt="Strava Connect" />
        </Link>
      </div>
    </section>
  );
}
