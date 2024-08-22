import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import PlausibleProvider from "next-plausible";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "700",
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExploreMap",
  description: "Share your adventures with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmMono.className} ${inter.className} `}>
        <PlausibleProvider domain="exploremap.io" />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
