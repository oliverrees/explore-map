import { supabase } from "../../lib/supabase/supabaseService";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NonAuthedHome } from "./components/non-authed/NonAuthedHome";
import { AuthedHome } from "./components/authed/AuthedHome";

const Home = async () => {
  const token = cookies().get("token");
  if (!token) {
    return <NonAuthedHome />;
  }
  return <AuthedHome token={token.value} />;
};

export default Home;
