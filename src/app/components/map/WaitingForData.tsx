import logo from "../../assets/img/logo.png";
import Image from "next/image";
interface WaitingForDataProps {}

export const WaitingForData = ({}: WaitingForDataProps) => {
  return (
    <>
      <Image src={logo} alt="logo" className="w-48" />
      <span className="relative inline-flex">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-white dark:bg-slate-800 transition ease-in-out duration-150 ring-1 ring-slate-900/10 dark:ring-slate-200/20">
          Waiting for first activity
        </div>
        <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </span>
    </>
  );
};
