import { getVideos } from "@/actions/getVideos";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isShort: boolean;
}

export default async function Tutorials() {
  const videos: Video[] = await getVideos(); // ✅ Fetch directly inside the server component

  // Separate Shorts and Regular Videos
  const shorts = videos.filter((video: Video) => video.isShort);
  const regularVideos = videos.filter((video: Video) => !video.isShort);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text">📚 Tutorials</h1>

      {/* Shorts Section */}
      {shorts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4 text-white">🎥 YouTube Shorts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shorts.map((video: Video) => (
              <div key={video.id} className="bg-white border rounded-xl shadow-lg p-3 transition-transform hover:scale-105">
                <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold mt-2 text-gray-800">{video.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regular Videos Section */}
      {regularVideos.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-white-800">📺 Full-Length Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularVideos.map((video: Video) => (
              <div key={video.id} className="bg-white border rounded-xl shadow-lg p-4 transition-transform hover:scale-105">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-800">{video.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{video.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
