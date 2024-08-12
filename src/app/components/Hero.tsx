"use client";
import Link from "next/link";
import backgroundImage from "../assets/img/mobileIso.png";
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
                blurDataURL="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"
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
                Visualise your runs, rides and hikes on an interactive map to
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
