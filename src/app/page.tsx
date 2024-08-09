import { Header } from "./components/Header";
import { HomeHeader } from "./components/HomeHeader";
import { ThreeCardPanel } from "./components/ThreeCardPanel";
import Image from "next/image";
import iso from "../app/assets/img/map.jpeg";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <div id="how"></div>
      <ThreeCardPanel
        noMargin
        title="How does it work?"
        description={[
          "We use the latest psychology, technology and neuroscience to measure your current state, help you discover insights about yourself and empower you to change and adapt.",
        ]}
        cards={[
          {
            id: 1,
            name: "Select",
            href: "/measure",
            description: [
              "We'll measure your brainwaves, sense of self and wellbeing levels during an immersive experience.",
            ],
            ctaText: "More about measurement",
            content: (
              <Image
                src={iso}
                alt="Discover"
                className="h-full w-full object-contain object-center bg-obsidian"
              />
            ),
          },
          {
            id: 2,
            name: "Enhance",
            href: "/discover",
            description: [
              "You'll then receive a discovery report containing a breakdown of your self, life and mind.",
            ],
            ctaText: "More about discovery",
            content: (
              <Image
                src={iso}
                alt="Discover"
                className="h-full w-full object-contain object-center bg-obsidian"
              />
            ),
          },
          {
            id: 3,
            name: "Share",
            href: "/change",
            description: [
              "How, or if, you want to change is up to you. We offer 180+ interventions that you can experiment with.",
            ],
            ctaText: "More about change",
            content: (
              <Image
                src={iso}
                alt="Measure Waves"
                className="h-full w-full object-contain p-6 object-center bg-obsidian"
              />
            ),
          },
        ]}
      />
    </>
  );
}
