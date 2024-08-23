import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "../../../../lib/supabase/supabaseService";

const PLAUSIBLE_API_URL = "https://plausible.io/api/v1/stats/aggregate";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mapId = searchParams.get("mapId");

  if (!mapId) {
    return NextResponse.json({ error: "Map ID is required" }, { status: 400 });
  }

  const authorization = req.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];

  // Verify the JWT token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // Extract strava_id from the token payload
  const { strava_id } = decodedToken as { strava_id: string };

  // Check if the strava_id owns the map
  const { data: map, error: mapError } = await supabase
    .from("exploremap_maps")
    .select("strava_id, slug")
    .eq("map_id", mapId)
    .single();

  if (mapError || !map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  if (parseInt(map.strava_id) !== parseInt(strava_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Construct the Plausible API URL
  const plausibleUrl = `https://plausible.io/api/v1/stats/aggregate?site_id=${
    process.env.PLAUSIBLE_DOMAIN_ID
  }&period=6mo&filters=event:page%3D%3D%2Fmap%2F${encodeURIComponent(
    map.slug
  )}`;

  // Make the request to Plausible API
  try {
    const response = await fetch(plausibleUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Plausible data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Plausible data" },
      { status: 500 }
    );
  }
}
