import Link from "next/link";
import logo from "../../assets/img/logoTrans.png";
import Image from "next/image";

interface ExploreBadgeProps {
  isScreenshot: boolean;
  isPublic: boolean;
  dark: boolean;
}

export const ExploreBadge = ({
  isScreenshot,
  isPublic,
  dark,
}: ExploreBadgeProps) => {
  if (!isPublic) return null;

  return (
    <Link
      target="_blank"
      href="/"
      className={`${
        dark ? "bg-black text-white" : "bg-white"
      } text-xs flex items-center font-light h-auto cursor-pointer p-1 whitespace-nowrap w-full justify-center `}
    >
      <Image src={logo} alt="logo" className="w-4 mr-1.5" />
      Made with{" "}
      <span className="font-semibold ml-1 text-blue-500">exploremap.io</span>
    </Link>
  );
};
