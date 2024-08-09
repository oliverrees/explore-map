interface ShadowCardProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export const ShadowCard = ({ children, darkMode }: ShadowCardProps) => {
  const shadowClass = darkMode ? "bg-lightBlack" : "bg-white";
  const bgShadowClass = darkMode ? "bg-white/5" : "bg-black/10";
  return (
    <div className="relative w-full h-full z-10">
      <div className={`block relative w-full h-full ${shadowClass}`}>
        {children}
      </div>
    </div>
  );
};
