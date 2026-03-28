import { getVideos } from "@/actions/getVideos";
import { getPlaylists } from "@/actions/getPlaylists";
import TutorialsClient from "@/components/tutorials/tutorials-client";
import { Youtube, ArrowRight, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Tutorials() {
  const [videos, playlists] = await Promise.all([
    getVideos("date"),
    getPlaylists()
  ]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-outfit">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px] -z-10" />

      <main className="container mx-auto px-4 pt-32 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Youtube className="h-4 w-4" />
              <span>Official Video Library</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 italic">
              Level Up Your <span className="gradient-text">Skills</span>
           </h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Deep-dive tutorials, quick tips, and comprehensive learning paths curated for modern developers. From zero to hero.
           </p>
            <div className="flex items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/tutorials/roadmaps">
                <Button className="rounded-full px-10 h-14 text-lg bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3 group">
                   <Youtube className="h-5 w-5" />
                   View Roadmaps
                   <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
         </div>

        {/* Client Side Filters and Content */}
        <TutorialsClient initialVideos={videos} playlists={playlists} />
      </main>
    </div>
  );
}
