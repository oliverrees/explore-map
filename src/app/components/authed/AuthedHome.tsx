"use client";
import { useEffect } from "react";
import { getSupabaseClient } from "../../../../lib/supabase/client";

interface AuthedHomeProps {
  token: string;
}

export const AuthedHome = ({ token }: AuthedHomeProps) => {
  const supabase = getSupabaseClient(token);
  useEffect(() => {
    /// get user data from supabase
    const getUserData = async () => {
      const { data } = await supabase.from("exploremap_users").select("*");
      if (data) {
        console.log(data);
      }
    };
    getUserData();
  }, []);
  return <div>Sign out</div>;
};
