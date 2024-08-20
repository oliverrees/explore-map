import { CardHolder } from "./../components/CardHolder";
import Image from "next/image";
import plan from "../../assets/img/plan.png";
import past from "../../assets/img/past.png";
import Link from "next/link";
import { Container } from "@/app/components/Container";
import { AppTitleBlock } from "../components/AppTitleBlock";
import { UserMaxWidth } from "../components/UserMaxWidth";

const types = [
  {
    name: "Past Activities",
    description:
      "Create a map from past activities on your Strava account. Ideal for viewing and sharing adventures you've already been on.",
    image: past,
    type: "past",
    isLive: true,
  },
  {
    name: "Future Activities",
    description:
      "Create a map from future activities on your Strava account. Ideal for sharing activities automatically as you log them to Strava.",
    image: plan,
    type: "live",
    isLive: true,
  },
];

export default function MapType() {
  return (
    <UserMaxWidth>
      <AppTitleBlock
        title="Choose a map type"
        description="Select the type of map you want to create"
      />
      <div className="mx-auto flex md:flex-row flex-col w-full gap-4 mt-6 pb-4">
        {types.map(({ name, description, image, type, isLive }) => (
          <CardHolder key={type}>
            <div
              className="flex flex-col items-center justify-center w-full h-full py-8"
              style={{
                opacity: isLive ? 1 : 0.25,
              }}
            >
              <Image src={image} alt={name} className="lg:h-56 h-24 w-auto" />
              <h3 className="mt-2 text-xl font-display font-semibold text-gray-900">
                {name}
              </h3>
              <p className="mt-3 text-sm font-normal text-gray-500 text-center px-4">
                {description}
              </p>
              <Link
                type="button"
                href={isLive ? `/app/new/${type}` : "#"}
                className="mt-6 rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm font-normal leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create a <span className="lowercase">{name}</span> map
              </Link>
            </div>
          </CardHolder>
        ))}
      </div>
      <div className="text-center font-normal text-xs mt-4">
        <p className="text-gray-500">
          <span className="font-semibold">
            Not sure which map type to pick?
          </span>{" "}
          If you want to create a map with a mix of past and future activities,
          select a past map and set up future activities later.
        </p>
      </div>
    </UserMaxWidth>
  );
}
