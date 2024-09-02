import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import PlausibleProvider from "next-plausible";
import NextTopLoader from "nextjs-toploader";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "700",
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://exploremap.io"),
  title: "ExploreMap - Share your adventures with the world",
  alternates: {
    canonical: "/",
  },
  description:
    "Select and group runs, rides or hikes on an interactive map to share with your friends",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "ExploreMap - Share your adventures with the world",
    description:
      "Select and group runs, rides or hikes on an interactive map to share with your friends",
    url: "https://exploremap.io",
    siteName: "ExploreMap",
    images: [
      {
        url: "https://exploremap.io/map.jpeg",
        width: 1200,
        height: 900,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmMono.className} ${inter.className} `}>
        <NextTopLoader
          showSpinner={false}
          color="rgb(37 99 235)"
          zIndex={100}
        />
        <PlausibleProvider domain="exploremap.io" />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
