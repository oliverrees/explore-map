import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabase = createClient(
  Deno.env.get("BASE_URL")!,
  Deno.env.get("BASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Adjust as needed
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
  };

  try {
    const allowedOrigins = [
      "https://exploremap.io",
      "https://staging.exploremap.io",
    ];

    const origin = req.headers.get("Origin") || "";

    if (allowedOrigins.includes(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
    }

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const { map_id } = await req.json();
    if (!map_id) {
      return new Response(
        JSON.stringify({ success: false, message: "map_id is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Lookup the slug for the map_id
    const { data: mapData, error: mapError } = await supabase
      .from("exploremap_maps")
      .select("slug")
      .eq("map_id", map_id)
      .single();

    if (mapError || !mapData) {
      return new Response(
        JSON.stringify({ success: false, message: "Map not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const { slug } = mapData;
    const url = `https://exploremap.io/map/${slug}?screenshot=true`;

    // GET request to Screenshot Machine API
    const screenshotResponse = await fetch(`https://api.screenshotmachine.com/?key=da4c24&url=${
      encodeURIComponent(url)
    }&dimension=1200x650&cacheLimit=0&delay=1000&crop=0%2C0%2C1200%2C620`, {
      method: "GET",
    });

    if (!screenshotResponse.ok) {
      throw new Error(`Failed to take screenshot: ${await screenshotResponse.text()}`);
    }

    const screenshotBuffer = await screenshotResponse.arrayBuffer();

    // Save the screenshot to Supabase Storage
    const fileName = `screenshots/${map_id}_${Date.now()}.jpg`;
    const { data, error: uploadError } = await supabase.storage
      .from("exploremap_screenshots")
      .upload(fileName, new Uint8Array(screenshotBuffer), {
        contentType: "image/jpg",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }

    const { data: publicURLData, error: publicUrlError } = supabase.storage
      .from("exploremap_screenshots")
      .getPublicUrl(fileName);

      const publicURL = publicURLData?.publicUrl;

      console.log("Getting public URL", publicURL);
      console.log("For file name", fileName);

    if (publicUrlError) {
      throw new Error(`Supabase get public URL error: ${publicUrlError.message}`);
    }

        // Clean up old screenshots (if any)
        const { data: oldScreenshots, error: oldScreenshotsError } = await supabase
        .from("exploremap_maps")
        .select("screenshot_url")
        .eq("map_id", map_id)
        .single();
  
      if (oldScreenshotsError) {
        throw new Error(`Supabase fetch old screenshots error: ${oldScreenshotsError.message}`);
      }

    // Update the map record with the new screenshot URL
    const { error: updateError } = await supabase
      .from("exploremap_maps")
      .update({ screenshot_url: publicURL })
      .eq("map_id", map_id);

      console.log('publicURL', publicURL);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    if (oldScreenshots?.screenshot_url) {
      const oldFileName = oldScreenshots.screenshot_url.split('/').pop();
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage
          .from("exploremap_screenshots")
          .remove([oldFileName]);

        if (deleteError) {
          throw new Error(`Supabase delete error: ${deleteError.message}`);
        }
      }

    }

    return new Response(
      JSON.stringify({ success: true, screenshot_url: publicURL }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
