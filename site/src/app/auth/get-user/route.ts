import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";
import { generateJWT } from "./lib/generateJWT";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const userData = await request.json();

  if (!userData.code) {
    return NextResponse.json({
      success: false,
      message: "No code",
    });
  }

  const body = new URLSearchParams();
  body.append("client_id", process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || "");
  body.append("client_secret", process.env.STRAVA_CLIENT_SECRET || "");
  body.append("code", userData.code);
  body.append("grant_type", "authorization_code");

  const stravaTokenResponse = await fetch(
    "https://www.strava.com/api/v3/oauth/token",
    {
      method: "POST",
      body: body,
    }
  );

  const stravaTokenData = await stravaTokenResponse.json();

  if (stravaTokenData.errors) {
    return NextResponse.json({
      success: false,
      message: "Strava token error",
      data: stravaTokenData,
    });
  }

  const { data, error } = await supabase
    .from("exploremap_users")
    .upsert(
      {
        strava_id: stravaTokenData.athlete.id,
        athelete_info: stravaTokenData.athlete,
        access_token: stravaTokenData.access_token,
        refresh_token: stravaTokenData.refresh_token,
        expires_at: stravaTokenData.expires_at,
      },
      {
        onConflict: "strava_id",
      }
    )
    .select();

  if (error) {
    return NextResponse.json({
      success: false,
      message: "Supabase error",
      data: error,
    });
  }

  const signedJWT = generateJWT(stravaTokenData.athlete.id);
  // const signedJWT = generateJWT("22704023");
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  cookies().set("token", signedJWT, { expires: Date.now() + sevenDays });

  return NextResponse.json({
    success: true,
    message: "User added or already exists",
    jwt: signedJWT,
  });
}
