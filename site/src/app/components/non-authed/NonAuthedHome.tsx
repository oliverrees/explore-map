"use client";
import { Header } from "../Header";
import { HomeHeader } from "../HomeHeader";
import { ThreeCardPanel } from "../ThreeCardPanel";
import Image from "next/image";
import select from "../../assets/img/past.png";
import enhance from "../../assets/img/enhance.png";
import share from "../../assets/img/share.png";
import grid from "../../assets/img/grid.png";
import isoBig from "../../assets/img/isoBig.jpeg";
import { TextImagePanel } from "../TextImagePanel";
import DemoStats from "../map/DemoStats";
import projectAfrica from "../../assets/img/projectAfrica.jpg";
import capeTown from "../../assets/img/capTown.jpg";
import cromer from "../../assets/img/cromer.jpg";
import { FAQs } from "./FAQs";
import { SignUp } from "../SignUp";

interface NonAuthedHomeProps {}

export const NonAuthedHome = ({}: NonAuthedHomeProps) => {
  return (
    <>
      <HomeHeader />
      <div id="how" />
      <ThreeCardPanel
        noMargin
        title="How does it work?"
        description={[
          "Choose which activities you want to share, enhance and customise and then share your map with friends, family and supporters.",
        ]}
        cards={[
          {
            id: 1,
            name: "Select",
            description: [
              "Connect to your Strava account and select the activities you want to add to your map.",
            ],
            content: (
              <div className="relative w-full h-full">
                <div
                  style={{
                    backgroundImage: `url(${grid.src})`,
                  }}
                  className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
                />
                <Image
                  src={select}
                  alt="Select"
                  className="h-full w-full object-contain object-center z-10 p-6 relative"
                />
              </div>
            ),
          },
          {
            id: 2,
            name: "Enhance",
            description: [
              "Customise and enhance your map with a range of filters and overlays to make it truly unique.",
            ],
            content: (
              <div className="relative w-full h-full">
                <div
                  style={{
                    backgroundImage: `url(${grid.src})`,
                  }}
                  className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
                />
                <Image
                  src={enhance}
                  alt="Enhance"
                  className="h-full w-full object-contain object-center z-10 p-6 relative"
                />
              </div>
            ),
          },
          {
            id: 3,
            name: "Share",
            description: [
              "Share your map with friends, family and supporters to show off your achievements.",
            ],
            content: (
              <div className="relative w-full h-full">
                <div
                  style={{
                    backgroundImage: `url(${grid.src})`,
                  }}
                  className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
                />
                <Image
                  src={share}
                  alt="Share"
                  className="h-full w-full object-contain object-center z-10 p-6 relative"
                />
              </div>
            ),
          },
        ]}
      />
      <div className="w-full overflow-hidden pb-12 -mt-16 lg:mt-0 -mb-6 lg:mb-0">
        <Image
          src={isoBig}
          alt={""}
          className="transform scale-125 lg:scale-100 w-full object-cover max-w-7xl mx-auto"
        />
      </div>
      <TextImagePanel
        topPadding={false}
        reverseSmall
        title={"Effortless Metrics"}
        image={<DemoStats />}
      >
        <>
          <p>
            Weather conditions, photos, performance metrics and more are
            automatically added to your map when you add your activities.
          </p>
          <p className="mb-6 lg:mb-0">
            Give your friends and family a deeper insight into your adventures
            with just a few clicks.
          </p>
        </>
      </TextImagePanel>

      <ThreeCardPanel
        topPadding={false}
        noMargin
        title="Featured Maps"
        description={[
          "Check out some of our favourite maps to get inspiration for your own.",
        ]}
        cards={[
          {
            id: 1,
            name: "Project Africa",
            href: "https://exploremap.io/map/project-africa",
            ctaText: "View Russ's Map",
            description: [
              "Russ Cook (AKA The Hardest Geezer) was the first man to run the length of Africa. This map shows his incredible journey.",
            ],
            content: (
              <div className="relative w-full h-full">
                <Image
                  src={projectAfrica}
                  alt="Project Africa"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ),
          },
          {
            id: 2,
            name: "Freiberg - Cape Town",
            href: "https://exploremap.io/map/freiberg-to-cape-town",
            ctaText: "View Wiebke's Map",
            description: [
              "Wiebke Lühmann is cycling from Freiberg in Germany to Cape Town in South Africa. This map is updated daily with her progress.",
            ],
            content: (
              <div className="relative w-full h-full">
                <Image
                  src={capeTown}
                  alt="Freiberg to Cape Town"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ),
          },
          {
            id: 3,
            name: "Cromer - Lands End",
            href: "https://exploremap.io/map/cromer-to-lands-end",
            ctaText: "View Sam's Map",
            description: [
              "Sam Hardy cycled from Cromer to Lands End in 60 hours. This map shows his route, photos and performance metrics.",
            ],
            content: (
              <div className="relative w-full h-full">
                <Image
                  src={cromer}
                  alt="Freiberg to Cape Town"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ),
          },
        ]}
      />
      {/* <FAQs /> */}
      <SignUp />
    </>
  );
};
