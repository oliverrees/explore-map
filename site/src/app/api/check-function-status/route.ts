import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";

export async function GET(req: NextRequest) {
  try {
    // Get the stravaId from query parameters
    const { searchParams } = new URL(req.url);
    const stravaId = searchParams.get("stravaId");

    if (!stravaId) {
      return NextResponse.json(
        { status: "error", message: "Strava ID is required" },
        { status: 400 }
      );
    }

    // Query the latest task for the given stravaId
    const { data, error } = await supabase
      .from("tasks")
      .select("status, data, updated_at")
      .eq("strava_id", stravaId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { status: "error", message: "Task not found or an error occurred" },
        { status: 404 }
      );
    }

    // Return the status of the task
    return NextResponse.json(
      { status: data.status, data: data.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error },
      { status: 500 }
    );
  }
}
