"use client";
import { useState, useEffect } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { Header } from "./Header";
import { Hero } from "./Hero";

interface HomeHeaderProps {}

export const HomeHeader = ({}: HomeHeaderProps) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const height = document.documentElement?.clientHeight;
    setHeight(height);
  }, []);
  return (
    <>
      {height === 0 && <LoadingScreen />}
      <div
        className="flex flex-col w-full relative overflow-hidden"
        style={{
          height: `${height}px`,
        }}
      >
        <Header darkMode />
        <Hero />
      </div>
    </>
  );
};
