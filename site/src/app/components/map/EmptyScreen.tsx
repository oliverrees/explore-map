import { HomeIcon } from "@heroicons/react/24/outline";
import grid from "../../assets/img/grid.png";
import logo from "../../assets/img/logoTrans.png";
import Image from "next/image";
import Link from "next/link";
interface WaitingForDataProps {
  text: string;
}

export const EmptyScreen = ({ text }: WaitingForDataProps) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${grid.src})`,
        }}
        className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
      ></div>

      <div className="flex items-center flex-col gap-4 justify-center h-screen font-medium z-10 relative">
        <Image src={logo} alt="logo" className="w-48" />
        <div className="text-xl">{text}</div>
        <Link
          href="/"
          className="bg-blue-600 text-white text-sm rounded px-4 py-2 flex gap-2 mt-4 cursor-pointer"
        >
          <HomeIcon className="text-white w-4" />
          Go Home
        </Link>
      </div>
    </>
  );
};
