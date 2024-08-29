import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabase = createClient(
  Deno.env.get("BASE_URL")!,
  Deno.env.get("BASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "",
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
    const url = `https://exploremap.io/map/${slug}?screenshot=true`; // Adjust URL as needed

    // POST request to /api/screenshot endpoint
    const screenshotResponse = await fetch("https://exploremap.io/api/screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!screenshotResponse.ok) {
      throw new Error(`Failed to take screenshot: ${await screenshotResponse.text()}`);
    }

    const screenshotBuffer = await screenshotResponse.arrayBuffer();

    // Save the screenshot to Supabase Storage
    const fileName = `screenshots/${map_id}_${Date.now()}.png`;
    const { data, error: uploadError } = await supabase.storage
      .from("exploremap_screenshots") // Bucket name
      .upload(fileName, new Uint8Array(screenshotBuffer), {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }

    const publicUrl = supabase.storage
      .from("exploremap_screenshots") // Bucket name
      .getPublicUrl(fileName).data.publicUrl;

    // Update the map record with the new screenshot URL
    const { error: updateError } = await supabase
      .from("exploremap_maps")
      .update({ screenshot_url: publicUrl })
      .eq("map_id", map_id);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
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

    if (oldScreenshots?.screenshot_url) {
      const oldFileName = oldScreenshots.screenshot_url.split('/').pop();
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage
          .from("exploremap_screenshots") // Bucket name
          .remove([oldFileName]);

        if (deleteError) {
          throw new Error(`Supabase delete error: ${deleteError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, screenshot_url: publicUrl }),
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
