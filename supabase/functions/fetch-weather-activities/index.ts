import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("BASE_URL")!,
    Deno.env.get("BASE_SERVICE_ROLE_KEY")!
  );

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
  };

  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const { activityIds } = await req.json();

    if (!activityIds || !Array.isArray(activityIds)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing or invalid parameter: activityIds",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    for (const activityId of activityIds) {
      const { data: existingActivity, error: activityError } = await supabase
        .from("exploremap_activities")
        .select("activity_data, weather")
        .eq("activity_id", activityId)
        .single();

      if (activityError || !existingActivity) {
        console.error(`Error fetching activity ${activityId}:`, activityError);
        continue;
      }

      if (!existingActivity.weather && existingActivity.activity_data?.start_latlng) {
        const startDate = existingActivity.activity_data.start_date;
        const startLat = existingActivity.activity_data.start_latlng[0];
        const startLon = existingActivity.activity_data.start_latlng[1];
        const timezone = existingActivity.activity_data.timezone;

        const weather = await getWeatherData(startDate, startLat, startLon, timezone);

        if (weather) {
          await supabase
            .from("exploremap_activities")
            .update({ weather })
            .eq("activity_id", activityId);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Weather data retrieved successfully for all activities",
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});

async function getWeatherData(startDate: string, lat: number, lon: number, timezone: string) {
  const activityDate = new Date(startDate);
  const currentDate = new Date();
  const daysDifference = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

  const extractedTimezone = timezone.split(" ").pop();
  if (!extractedTimezone) {
    throw new Error("Timezone format is incorrect");
  }

  const encodedTimezone = encodeURIComponent(extractedTimezone);
  let url: string;

  // Extract the date part from the startDate (YYYY-MM-DD)
  const formattedDate = activityDate.toISOString().split('T')[0];

  if (daysDifference <= 5 && daysDifference >= 0) {
    // Use forecast endpoint
    url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum,wind_speed_10m_max&timezone=${encodedTimezone}&past_days=5&forecast_days=1`;
  } else {
    // Use historical endpoint
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formattedDate}&end_date=${formattedDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum,wind_speed_10m_max&timezone=${encodedTimezone}`;
  }

  console.log(`Fetching weather data for ${lat}, ${lon} on ${formattedDate}`);
  console.log(`URL: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    console.log(`Failed to fetch weather data for ${lat}, ${lon} on ${formattedDate}`);
    return null;
  }

  const weatherData = await response.json();

  // Ensure the 'time' array exists and contains the relevant date
  if (weatherData.daily && weatherData.daily.time && Array.isArray(weatherData.daily.time)) {
    const relevantDateIndex = weatherData.daily.time.indexOf(formattedDate);
    if (relevantDateIndex === -1) {
      console.log(`Date ${formattedDate} not found in weather data`);
      return null;
    }

    // Format the data as needed for the relevant date
    return {
      time: [weatherData.daily.time[relevantDateIndex]],
      rain_sum: [weatherData.daily.rain_sum[relevantDateIndex]],
      snowfall_sum: [weatherData.daily.snowfall_sum[relevantDateIndex]],
      precipitation_sum: [weatherData.daily.precipitation_sum[relevantDateIndex]],
      temperature_2m_max: [weatherData.daily.temperature_2m_max[relevantDateIndex]],
      temperature_2m_min: [weatherData.daily.temperature_2m_min[relevantDateIndex]],
      wind_speed_10m_max: [weatherData.daily.wind_speed_10m_max[relevantDateIndex]],
      temperature_2m_mean: [weatherData.daily.temperature_2m_mean[relevantDateIndex]]
    };
  }

  // Handle historical API response
  if (weatherData.daily) {
    return weatherData.daily;
  }

  // If neither condition is met, return null indicating no data could be processed
  return null;
}

