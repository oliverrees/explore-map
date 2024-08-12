import { CardHolder } from "../../components/CardHolder";
import Image from "next/image";
import plan from "../../../assets/img/plan.png";
import past from "../../../assets/img/past.png";

interface MapTypeProps {
  onSelectType: (type: "future" | "past") => void;
}

const types = [
  {
    name: "Past Activities",
    description:
      "Create a map from past activities on your Strava account. Ideal for viewing and sharing adventures you've already been on.",
    image: past,
    type: "past",
    isLive: false,
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

export const MapType = ({ onSelectType }: MapTypeProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col w-full max-w-md mx-auto text-center">
        <h3 className="mt-2 text-2xl font-display font-semibold text-gray-900">
          Select a map type
        </h3>
        <p className="mt-3 text-sm font-medium text-gray-500">
          What kind of map would you like to create?
        </p>
      </div>
      <div className="max-w-5xl mx-auto flex w-full gap-4 mt-6">
        {types.map(({ name, description, image, type }) => (
          <CardHolder key={type}>
            <div
              className="flex flex-col items-center justify-center w-full h-full mt-12 mb-6"
              style={{
                opacity: type === "live" ? 0.25 : 1,
              }}
            >
              <Image src={image} alt={name} className="h-56 w-auto" />
              <h3 className="mt-2 text-xl font-display font-semibold text-gray-900">
                {name}
              </h3>
              <p className="mt-3 text-sm font-medium text-gray-500 text-center">
                {description}
              </p>
              <button
                type="button"
                onClick={() => onSelectType(type as "future" | "past")}
                className="mt-6 rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create a <span className="lowercase">{name}</span> map
              </button>
            </div>
          </CardHolder>
        ))}
      </div>
    </div>
  );
};
