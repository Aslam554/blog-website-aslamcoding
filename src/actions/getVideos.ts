"use server";

export async function getVideos() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
  const MAX_RESULTS = 30;

  if (!API_KEY || !CHANNEL_ID) {
    console.error("❌ Missing API_KEY or CHANNEL_ID");
    return [];
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;

    const res = await fetch(url);
    const data: YoutubeAPIResponse = await res.json();

    if (!res.ok || data.error) {
      console.error("❌ API Error:", data.error?.message);
      return [];
    }

    return data.items.map((item: YoutubeAPIItem) => {
      const title = item.snippet.title.toLowerCase();
      return {
        id: item.id?.videoId ?? "",
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
        isShort: title.includes("shorts") || item.snippet.liveBroadcastContent === "shorts",
      };
    });
  } catch (error) {
    console.error("❌ Fetch Error:", (error as Error).message);
    return [];
  }
}

interface YoutubeAPIResponse {
  items: YoutubeAPIItem[];
  error?: {
    message: string;
  };
}

interface YoutubeAPIItem {
  id?: {
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: {
        url: string;
      };
    };
    liveBroadcastContent: string;
  };
}
