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
  const fetchMapTitle = async () => {
    try {
      const { data: mapData, error: mapError } = await supabase
        .from("exploremap_maps")
        .select("map_name")
        .eq("slug", mapSlug)
        .eq("is_shared", true)
        .single();
      if (mapError) throw new Error(mapError.message);
      return mapData.map_name;
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };
  const title = await fetchMapTitle();
  return {
    title,
  };
}

export default async function Page({
  params,
}: {
  params: { mapSlug: string };
}) {
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

      // Fetch the activities details from the exploremap_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("exploremap_activities")
        .select("weather, photos, activity_id, activity_data")
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

  return <MapHolder data={mapData} />;
}
