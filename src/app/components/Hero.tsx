"use client";
import Link from "next/link";
import backgroundImageLarge from "../assets/img/largeIso.png";
import grid from "../assets/img/grid.png";
import Image from "next/image";
import stravaConnect from "../assets/img/connect.svg";
import { getStravaAuthUrl } from "../../../lib/auth/functions/getStravaAuthUrl";

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
          className="lg:w-2/3 w-full lg:h-full h-6 absolute lg:left-0 left-0 lg:top-0 bottom-0 z-0
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
            <div className="w-full h-full relative overflow-x-clip lg:top-0 lg:h-96 transform scale-[2.1] lg:scale-[2.5] lg:translate-x-[30rem] translate-x-72 translate-y-8">
              <Image
                src={backgroundImageLarge}
                alt="Map"
                placeholder="blur"
                priority
                className="absolute w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="lg:order-1 flex items-center flex-col px-4 lg:px-0 md:pb-6 md:pt-6 lg:py-0 lg:mt-5 w-full">
            <div className="h-auto relative z-10">
              <h1 className="text-[2rem] leading-10 md:text-5xl md:leading-13 xl:leading-13 xl:text-[3.5rem] lg:leading-tight font-display font-semibold text-black">
                Share your adventures with the world
              </h1>
              <div className="text-md md:text-lg xl:text-xl mt-3 md:mt-4 leading-6 font-light xl:leading-8 xl:w-10/12">
                Select and group runs, rides or hikes on an interactive map to
                share with your friends
              </div>
              <div className="flex gap-20 items-center flex-col lg:flex-row gap-x-12 gap-y-3 w-full mt-6 md:mt-8 lg:mt-10 h-auto">
                <Link
                  href={getStravaAuthUrl()}
                  className="w-full bg-[#FC4C02] lg:w-auto flex justify-center"
                >
                  <Image src={stravaConnect} alt="Strava Connect" />
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
