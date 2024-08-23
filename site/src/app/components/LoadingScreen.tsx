import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center flex-col fixed top-0 left-0 z-50 bg-white">
      <LoadingSpinner />
    </div>
  );
};
