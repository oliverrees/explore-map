import { Container } from "@/app/components/Container";
import { Header } from "@/app/components/Header";
import Link from "next/link";
import React from "react";
import { getStravaAuthUrl } from "../../../lib/auth/functions/getStravaAuthUrl";
import stravaConnect from "../assets/img/connect.svg";
import Image from "next/image";
import { TextImagePanel } from "../components/TextImagePanel";
import map from "../assets/img/map.png";

export default function LoginPage() {
  return (
    <>
      <Header />
      <Container customPadding="py-6 px-6 lg:px-0 font-light">
        <TextImagePanel
          topPadding={false}
          title={"Sign in with Strava"}
          image={<Image src={map} alt={""} />}
        >
          <>
            <p>Manage your maps and activities by signing in.</p>

            <Link
              href={getStravaAuthUrl()}
              className="w-full bg-[#FC4C02] lg:w-auto flex justify-center"
            >
              <Image src={stravaConnect} alt="Strava Connect" />
            </Link>
          </>
        </TextImagePanel>
      </Container>
    </>
  );
}
