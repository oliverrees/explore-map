import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "700",
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Explore Map",
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
        {children}
      </body>
    </html>
  );
}
