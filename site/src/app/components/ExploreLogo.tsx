import Image from "next/image";
import logo from "../assets/img/logo.png";
interface StateLogoProps {}

export const ExploreLogo = ({}: StateLogoProps) => {
  return (
    <div className="flex font-light gap-3 items-center ">
      <Image src={logo} alt={"Logo"} className="w-8" />
      <div>
        explore<span className="font-semibold">map</span>
      </div>
    </div>
  );
};
