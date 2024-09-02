"use client";
import Link from "next/link";
import backgroundImageLarge from "../assets/img/newhero1.jpg";
import grid from "../assets/img/grid.png";
import Image from "next/image";
import stravaConnect from "../assets/img/connect.svg";
import { getStravaAuthUrl } from "../../../lib/auth/functions/getStravaAuthUrl";
import demoRide from "../data/demoRide.json";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";
import strava from "../assets/img/strava.png";

const Map = dynamic(() => import("../components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner />
    </div>
  ),
});

interface HeroProps {}

export const Hero = ({}: HeroProps) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${grid.src})`,
        }}
        className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
      >
        <div
          className="lg:w-1/3 w-full lg:h-full h-6 absolute lg:left-0 left-0 lg:top-0 bottom-0 z-0
      lg:bg-gradient-to-r bg-gradient-to-t from-white to-transparent"
        />
        <div
          className="w-full h-24 absolute left-0 top-0 lg:bottom-0 lg:top-auto z-0
     bg-gradient-to-t from-transparent to-white lg:bg-gradient-to-b "
        />
      </div>
      <div className="max-w-7xl mx-auto h-full relative w-full lg:px-8 lg:py-36 4xl:py-48">
        <div className="flex flex-col lg:flex-row h-full justify-center items-center gap-5 lg:gap-16">
          <div className="h-full lg:max-h-96 w-full lg:w-11/12 lg:order-2 z-10">
            <div className=" h-full relative overflow-hidden lg:top-0 lg:h-96 mx-4 shadow-sm rounded-lg bg-white">
              <Image
                src={strava}
                alt="Strava"
                className="absolute  z-10 h-12 w-auto left-2 bottom-2"
              />
              <Map data={demoRide} isPublic={true} isHome={true} />
            </div>
          </div>
          <div className="lg:order-1 flex items-center flex-col px-4 lg:px-0 md:pb-6 md:pt-6 lg:py-0 lg:mt-5 w-full">
            <div className="h-auto relative z-10">
              <h1 className="text-[1.95rem] leading-1 md:text-5xl md:leading-13 xl:leading-13 xl:text-[3.5rem] lg:leading-tight font-display font-bold text-black [word-spacing:-10px]">
                Map your adventures
              </h1>
              <div className="text-md md:text-lg xl:text-xl mt-3 md:mt-4 leading-6 font-light xl:leading-8 xl:w-10/12">
                Combine multiple Strava activities into a single interactive map
                to share with friends and family.
              </div>
              <div className="flex gap-20 items-center flex-col lg:flex-row gap-x-12 gap-y-3 w-full mt-6 md:mt-8 lg:mt-10 h-auto">
                {/* <Link
                  href={getStravaAuthUrl()}
                  className="w-full bg-[#FC4C02] lg:w-auto flex justify-center"
                >
                  <Image src={stravaConnect} alt="Strava Connect" />
                </Link> */}
                <Link
                  href={"/join"}
                  className="w-full lg:w-auto rounded-md bg-blue-600 px-3 py-2 lg:px-6 lg:py-3 text-center text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Join the waitlist
                </Link>
                <a
                  href="#how"
                  className="text-xs w-full lg:w-auto lg:inline-flex text-black/30 text-center lg:text-lg hover:text-black/90 transition-all duration-300 ease-in-out mb-3 lg:mb-0"
                >
                  How does it work?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
