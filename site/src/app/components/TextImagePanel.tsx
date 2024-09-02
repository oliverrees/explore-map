import Link from "next/link";
import { LinkButton } from "./LinkButton";
import { Container } from "./Container";
import { TitleBlock } from "./TitleBlock";

interface TextImagePanelProps {
  title: string;
  children?: React.ReactNode;
  image: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
  reverseSmall?: boolean;
  reverseLarge?: boolean;
  darkMode?: boolean;
  topPadding?: boolean;
  background?: string;
  ctaBlank?: boolean;
}

export const TextImagePanel = ({
  title,
  children,
  image,
  ctaText,
  ctaLink,
  ctaBlank,
  reverseSmall = false,
  reverseLarge = false,
  darkMode,
  background,
  topPadding = true,
}: TextImagePanelProps) => {
  const darkModeText = darkMode ? "text-white" : "text-black";
  const orderClassesLeftSmall = reverseSmall ? "order-2" : "order-1";
  const orderClassesLeftLarge = reverseLarge ? "lg:order-1" : "lg:order-2";
  const orderClassesRightSmall = reverseSmall ? "order-1" : "order-2";
  const orderClassesRightLarge = reverseLarge ? "lg:order-2" : "lg:order-1";

  return (
    <Container dark={darkMode} background={background} topPadding={topPadding}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between">
        <div
          className={`${orderClassesLeftSmall} ${orderClassesLeftLarge} lg:w-6/12 h-auto w-full`}
        >
          <div className="relative w-full h-full">{image}</div>
        </div>
        <div
          className={`${orderClassesRightSmall} ${orderClassesRightLarge} lg:w-5/12 mt-4 lg:mt-0 px-4 lg:px-0`}
        >
          <div className="mt-4 lg:mt-6 lg:text-lg lg:max-w-4xl">
            <TitleBlock title={title} dark={darkMode} />
            <div
              className={`flex flex-col gap-6 max-w-lg lg:max-w-2xl font-light ${darkModeText}/70`}
            >
              {children}
            </div>
            {ctaLink && ctaText && (
              <div className="mt-8">
                <LinkButton
                  ctaBlank={ctaBlank}
                  darkMode={darkMode}
                  ctaText={ctaText}
                  ctaLink={ctaLink}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
