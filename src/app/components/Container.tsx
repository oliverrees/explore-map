interface ContainerProps {
  children: React.ReactNode;
  dark?: boolean;
  topPadding?: boolean;
  background?: string;
  customPadding?: boolean | string;
}

export const Container = ({
  children,
  dark = false,
  topPadding = true,
  customPadding = false,
  background,
}: ContainerProps) => {
  const darkMode = background
    ? background
    : dark
    ? "bg-obsidian text-white"
    : "bg-white text-black";
  const padding = !customPadding
    ? topPadding
      ? "pt-24 pb-24 lg:py-32 2xl:py-32"
      : "pb-24 lg:py-32 2xl:py-32"
    : customPadding;
  return (
    <div className={`${darkMode}`}>
      <div className={`${padding}  lg:mx-auto lg:max-w-7xl lg:px-8`}>
        {children}
      </div>
    </div>
  );
};
