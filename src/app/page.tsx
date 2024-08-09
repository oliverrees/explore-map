import { Header } from "./components/Header";
import { HomeHeader } from "./components/HomeHeader";
import { ThreeCardPanel } from "./components/ThreeCardPanel";
import Image from "next/image";
import select from "./assets/img/select.png";
import enhance from "./assets/img/enhance.png";
import share from "./assets/img/share.png";
import grid from "./assets/img/grid.png";
import isoBig from "./assets/img/isoBig.png";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <div id="how" />
      <ThreeCardPanel
        noMargin
        title="How does it work?"
        description={[
          "Choose which activities you want to share, enhance and customise your map and then share it with the world",
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
                  className="h-full w-full object-contain object-center z-10 p-2 relative"
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
                  className="h-full w-full object-contain object-center z-10 p-2 relative"
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
                  className="h-full w-full object-contain object-center z-10 p-2 relative"
                />
              </div>
            ),
          },
        ]}
      />
      {/* <Image src={isoBig} alt={""} className="transform scale-150" /> */}
    </>
  );
}
