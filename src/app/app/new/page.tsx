import { CardHolder } from "./../components/CardHolder";
import Image from "next/image";
import plan from "../../assets/img/plan.png";
import past from "../../assets/img/past.png";
import Link from "next/link";

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
    isLive: false,
  },
];

export default function MapType() {
  return (
    <div className="md:h-full md:flex flex-col md:items-center md:justify-center px-8 md:px-0 pb-12">
      <div className="flex flex-col w-full max-w-md mx-auto text-center">
        <h3 className="mt-2 text-2xl font-display font-semibold text-gray-900">
          Select a map type
        </h3>
        <p className="mt-3 text-sm font-medium text-gray-500">
          What kind of map would you like to create?
        </p>
      </div>
      <div className="max-w-5xl mx-auto flex md:flex-row flex-col w-full gap-4 mt-6">
        {types.map(({ name, description, image, type, isLive }) => (
          <CardHolder key={type}>
            <div
              className="flex flex-col items-center justify-center w-full h-full mt-12 mb-6"
              style={{
                opacity: isLive ? 1 : 0.25,
              }}
            >
              <Image src={image} alt={name} className="lg:h-56 h-24 w-auto" />
              <h3 className="mt-2 text-xl font-display font-semibold text-gray-900">
                {name}
              </h3>
              <p className="mt-3 text-sm font-medium text-gray-500 text-center px-4">
                {description}
              </p>
              <Link
                type="button"
                href={isLive ? `/app/new/${type}` : "#"}
                className="mt-6 rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create a <span className="lowercase">{name}</span> map
              </Link>
            </div>
          </CardHolder>
        ))}
      </div>
    </div>
  );
}
