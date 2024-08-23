import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseService";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string;

interface Video {
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelId: string;
  stravaId: string;
}

interface RequestBody {
  channelId: string;
  stravaId: string;
}

export async function POST(request: Request): Promise<Response> {
  const { channelId, stravaId }: RequestBody = await request.json();

  if (!channelId || !stravaId) {
    return NextResponse.json(
      { error: "Missing required parameters: channelId or stravaId" },
      { status: 400 }
    );
  }

  const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`;
  let nextPageToken = "";
  let videos: Video[] = [];

  try {
    do {
      const response = await fetch(`${baseUrl}&pageToken=${nextPageToken}`);
      const data = await response.json();

      if (response.ok && data.items) {
        videos = [
          ...videos,
          ...data.items.map((item: any) => ({
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelId: channelId,
            stravaId: stravaId,
          })),
        ];

        nextPageToken = data.nextPageToken || "";
      } else {
        throw new Error(
          data.error?.message || "Failed to fetch YouTube videos"
        );
      }
    } while (nextPageToken);

    const { error } = await supabase.from("exploremap_youtube").insert(videos);

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to insert data into Supabase",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Videos inserted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
