"use client";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import { NoMap } from "@/app/components/authed/components/home/NoMap";

export default function AuthedHome() {
  return <NoMap />;
}
