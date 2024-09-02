import Link from "next/link";

interface LinkButtonProps {
  ctaText: string;
  ctaLink: string;
  ctaBlank?: boolean;
  darkMode?: boolean;
}

export const LinkButton = ({
  ctaText,
  ctaLink,
  darkMode,
  ctaBlank,
}: LinkButtonProps) => {
  const background = darkMode
    ? "bg-white text-black hover:bg-white/80"
    : "hover:bg-black hover:text-white";
  return (
    <Link
      href={ctaLink}
      target={"_blank"}
      className={`rounded-lg z-10 relative font-semibold text-sm border border-black py-2 px-4 inline-block  transition-all duration-300 ease-in-out ${background}`}
    >
      {ctaText} &rarr;
    </Link>
  );
};
