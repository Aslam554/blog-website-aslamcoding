"use server";

export async function getPlaylists() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
  const MAX_RESULTS = 10;

  if (!API_KEY || !CHANNEL_ID) {
    console.error("❌ Missing API_KEY or CHANNEL_ID");
    return [];
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("❌ API Error:", data.error?.message);
      return [];
    }

    return (data.items as {
      id: string;
      snippet: {
        title: string;
        description: string;
        thumbnails?: { medium?: { url: string } };
      };
      contentDetails?: { itemCount: number };
    }[]).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
      videoCount: item.contentDetails?.itemCount || 0,
    }));
  } catch (error) {
    console.error("❌ Fetch Error:", (error as Error).message);
    return [];
  }
}
