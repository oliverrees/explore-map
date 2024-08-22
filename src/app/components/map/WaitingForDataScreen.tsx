import grid from "../../assets/img/grid.png";
import { WaitingForData } from "./WaitingForData";
interface WaitingForDataProps {}

export const WaitingForDataScreen = ({}: WaitingForDataProps) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${grid.src})`,
        }}
        className="absolute top-0 lg:right-0 lg:w-full w-full lg:h-full h-full z-0 bg-repeat"
      ></div>
      <div className="flex items-center flex-col gap-4 justify-center h-screen">
        <WaitingForData />
      </div>
    </>
  );
};
