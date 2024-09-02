import Link from "next/link";
import { LinkButton } from "./LinkButton";

export function SignUp() {
  return (
    <section className="relative bg-gray-50 overflow-hidden bg-obsidian py-20 sm:py-28">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-semibold font-display tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg  mb-6 mx-4 font-normal">
          We are currently in private beta. Join the waitlist to get early
          access.
        </p>
        <Link
          href={"/join"}
          className="w-full lg:w-auto rounded-md bg-blue-600 px-3 py-2 lg:px-6 lg:py-3 text-center text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Join the waitlist
        </Link>
      </div>
    </section>
  );
}
