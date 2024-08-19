"use client";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";
import { NoMap } from "../components/NoMap";

export default function AuthedHome() {
  return <NoMap />;
}
