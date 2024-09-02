import Image from "next/image";
import { ShadowCard } from "./ShadowCard";
import { LinkButton } from "./LinkButton";
import { Container } from "./Container";
import { TitleBlock } from "./TitleBlock";

interface Card {
  id: number;
  name: string;
  description: string[];
  content: JSX.Element;
  href?: string;
  ctaText?: string;
}

interface ThreeCardPanelProps {
  cards: Card[];
  title: string;
  description: string[];
  dark?: boolean;
  topPadding?: boolean;
  noMargin?: boolean;
  href?: string;
  ctaText?: string;
}

export const ThreeCardPanel = ({
  title,
  description,
  cards,
  dark,
  noMargin,
  topPadding = true,
  href,
  ctaText,
}: ThreeCardPanelProps) => {
  const darkModeText = dark ? "text-white" : "text-black";
  const gridColsClass =
    cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <Container>
      <div className={`flex flex-col justify-between`}>
        <div className="px-4 sm:px-6 lg:px-0">
          <TitleBlock title={title} description={description} dark={dark} />
          {href && ctaText && (
            <div className="mt-8">
              <LinkButton ctaText={ctaText} ctaLink={href} />
            </div>
          )}
        </div>

        <div className="relative mt-8 lg:mt-12">
          <div className="relative -mb-6 w-full overflow-x-auto pb-2 no-scrollbar">
            <ul
              role="list"
              className={`${gridColsClass} mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:gap-x-12 lg:space-x-0 pr-4 items-start flex-grow mb-4`}
            >
              {cards.map((card: any) => (
                <ShadowCard key={card.id} darkMode={dark}>
                  <li
                    className={`inline-flex w-72 flex-col lg:w-full ${darkModeText}`}
                  >
                    <div className="group relative">
                      <div className="w-full h-64 relative overflow-hidden rounded-xl shadow-lg border">
                        {card.content}
                      </div>
                      <div className="p-2 pt-4 lg:pt-6">
                        <h3 className="mt-1 text-2xl font-display leading-normal font-semibold [word-spacing:-7px]">
                          {card.name}
                        </h3>
                        <div className="mt-2 mb-2 font-light text-md opacity-80 flex flex-col gap-4">
                          {card.description.map(
                            (desc: string, index: number) => (
                              <div key={index}>{desc}</div>
                            )
                          )}
                        </div>
                        {card.href && (
                          <div className="mt-6">
                            <LinkButton
                              darkMode={dark}
                              ctaText={card.ctaText}
                              ctaLink={card.href}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                </ShadowCard>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};
