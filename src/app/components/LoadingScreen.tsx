export const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center flex-col fixed top-0 left-0 z-50 bg-white">
      <div className="inline-block h-8 w-8 text-black animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
      </div>
    </div>
  );
};
