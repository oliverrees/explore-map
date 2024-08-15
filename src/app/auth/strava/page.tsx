"use client";
import { Suspense, useEffect, useRef } from "react";
import { LoadingScreen } from "../../components/LoadingScreen";
import { LoadUser } from "./LoadUser";
export default function Track() {
  return (
    <Suspense>
      <LoadUser />
    </Suspense>
  );
}
