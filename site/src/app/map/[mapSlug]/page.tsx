import { supabase } from "../../../../lib/supabase/supabaseService";
import { MapHolder } from "./components/MapHolder";
import { processMapData } from "@/app/components/map/lib/processMapData";
import { EmptyScreen } from "@/app/components/map/EmptyScreen";

export const revalidate = 5;

export async function generateMetadata({
  params,
}: {
  params: { mapSlug: string };
}) {
  const mapSlug = params.mapSlug;
  if (!mapSlug) {
    return {
      title: "Map not found",
    };
  }

  const fetchMapDetails = async () => {
    try {
      const { data: mapData, error: mapError } = await supabase
        .from("exploremap_maps")
        .select("map_name, screenshot_url")
        .eq("slug", mapSlug)
        .eq("is_shared", true)
        .single();
      if (mapError) throw new Error(mapError.message);
      return mapData;
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  const mapDetails = await fetchMapDetails();
  return {
    title: mapDetails?.map_name || "Map not found",
    image: mapDetails?.screenshot_url || "",
    openGraph: {
      title: mapDetails?.map_name || "Map not found",
      description: `View the map ${mapDetails?.map_name} on ExploreMap`,
      url: "https://exploremap.io",
      siteName: "ExploreMap",
      images: [
        {
          url: mapDetails?.screenshot_url || "",
          width: 1200,
          height: 900,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
  };
}

export default async function Page({
  searchParams,
  params,
}: {
  params: { mapSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isScreenshot = searchParams.screenshot === "true";
  const mapSlug = params.mapSlug;
  if (!mapSlug) {
    return (
      <div className="flex items-center justify-center h-full mt-24">
        Map not found
      </div>
    );
  }

  const fetchMapData = async () => {
    if (!mapSlug) {
      return;
    }
    try {
      // Fetch the map activities from the exploremap_maps table
      const { data: mapData, error: mapError } = await supabase
        .from("exploremap_maps")
        .select("*")
        .eq("slug", mapSlug)
        .eq("is_shared", true)
        .single();

      if (mapError) throw new Error(mapError.message);

      const dataToGet =
        mapData.map_activities.length < 50
          ? "weather, photos, activity_id, activity_data, activity_detail"
          : "weather, photos, activity_id, activity_data";

      // Fetch the activities details from the exploremap_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("exploremap_activities")
        .select(dataToGet)
        .order("activity_id", { ascending: false })
        .in("activity_id", mapData.map_activities);

      if (activitiesError) throw new Error(activitiesError.message);

      return processMapData(mapData, activitiesData);
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  const mapData = await fetchMapData();

  if (!mapData) {
    return <EmptyScreen text="Map not found" />;
  }

  return <MapHolder data={mapData} isScreenshot={isScreenshot} />;
}
