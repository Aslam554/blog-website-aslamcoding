"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  TrendingUp,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isShort: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

interface TutorialsClientProps {
  initialVideos: Video[];
  playlists: Playlist[];
}

type FilterType = "all" | "shorts" | "videos" | "playlists";

export default function TutorialsClient({ initialVideos, playlists }: TutorialsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<{ id: string, type: 'video' | 'playlist' } | null>(null);

  const filteredVideos = useMemo(() => {
    let filtered = initialVideos;
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter === "shorts") return filtered.filter(v => v.isShort);
    if (activeFilter === "videos") return filtered.filter(v => !v.isShort);
    return filtered;
  }, [initialVideos, activeFilter, searchQuery]);

  const filteredPlaylists = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "playlists") return [];
    if (!searchQuery) return playlists;
    return playlists.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playlists, activeFilter, searchQuery]);

  const filters = [
    { id: "all", label: "All Content", icon: Layers },
    { id: "videos", label: "Full Tutorials", icon: Play },
    { id: "shorts", label: "Quick Tips", icon: Clock },
    { id: "playlists", label: "Series", icon: TrendingUp },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass p-6 rounded-[32px] border-white/10 sticky top-24 z-40 bg-background/40 backdrop-blur-xl">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search tutorials, playlists..." 
            className="pl-12 h-14 rounded-2xl bg-muted/30 border-white/5 focus:ring-primary/20 transition-all text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "ghost"}
                className={cn(
                  "rounded-full h-12 px-6 gap-2 font-bold transition-all",
                  activeFilter === filter.id ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-primary/10"
                )}
                onClick={() => setActiveFilter(filter.id as FilterType)}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter + searchQuery}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-16"
        >
          {/* Playlists Section */}
          {(activeFilter === "all" || activeFilter === "playlists") && filteredPlaylists.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-outfit font-bold tracking-tight flex items-center gap-3">
                  <span className="h-10 w-2 bg-primary rounded-full" />
                  Learning Tracks
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlaylists.map((playlist) => (
                  <motion.div 
                    key={playlist.id}
                    whileHover={{ y: -8 }}
                    className="glass-card group p-4 rounded-[40px] border-white/5 hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => setPlayingVideo({ id: playlist.id, type: 'playlist' })}
                  >
                    <div className="relative aspect-video rounded-[32px] overflow-hidden mb-6">
                      <Image 
                        src={playlist.thumbnail} 
                        alt={playlist.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Button className="rounded-full h-14 w-14 bg-white text-black hover:bg-white/90">
                           <Play className="h-6 w-6 fill-current" />
                        </Button>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2">
                         <Layers className="h-3 w-3" />
                         {playlist.videoCount} Videos
                      </div>
                    </div>
                    <div className="px-2 space-y-3">
                      <h3 className="text-xl font-outfit font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {playlist.description}
                      </p>
                      <Button variant="ghost" className="w-full justify-between rounded-2xl h-12 hover:bg-primary/5 group/btn">
                         <span className="font-bold text-sm">View Syllabus</span>
                         <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Videos Grid */}
          {(activeFilter === "all" || activeFilter === "videos") && filteredVideos.filter(v => !v.isShort).length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-outfit font-bold tracking-tight flex items-center gap-3">
                  <span className="h-10 w-2 bg-purple-500 rounded-full" />
                  Video Masterclasses
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredVideos.filter(v => !v.isShort).map((video) => (
                  <motion.div 
                    key={video.id}
                    layout
                    onClick={() => setPlayingVideo({ id: video.id, type: 'video' })}
                    className="flex flex-col sm:flex-row gap-6 p-4 glass rounded-[40px] border-white/5 hover:border-purple-500/20 transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-video sm:w-64 rounded-[32px] overflow-hidden flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                           <Play className="h-6 w-6 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-2 py-2">
                      <h3 className="text-lg font-outfit font-bold text-foreground line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <a 
                          href={`https://youtube.com/watch?v=${video.id}`} 
                          target="_blank" 
                          className="text-xs font-bold text-purple-500 flex items-center gap-1 hover:underline"
                        >
                          Watch on YouTube <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Shorts Horizontal Scroll */}
          {(activeFilter === "all" || activeFilter === "shorts") && filteredVideos.filter(v => v.isShort).length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-outfit font-bold tracking-tight flex items-center gap-3">
                  <span className="h-10 w-2 bg-red-500 rounded-full" />
                  Bit-sized Knowledge
                </h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                {filteredVideos.filter(v => v.isShort).map((video) => (
                  <motion.div 
                    key={video.id}
                    layout
                    className="flex-shrink-0 w-64 glass p-3 rounded-[32px] border-white/5 group hover:border-red-500/20 transition-all"
                  >
                    <div className="relative aspect-[9/16] rounded-[24px] overflow-hidden mb-4">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1`}
                        title={video.title}
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <h3 className="font-outfit font-bold text-sm text-foreground line-clamp-2 px-2 group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {filteredVideos.length === 0 && filteredPlaylists.length === 0 && (
            <div className="py-40 text-center space-y-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
                 <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-outfit font-bold">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any videos or playlists matching your search. Try different keywords or check out our full collection.
              </p>
              <Button variant="outline" onClick={() => {setSearchQuery(""); setActiveFilter("all");}} className="rounded-full px-8 h-12">
                 Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setPlayingVideo(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/80"
                onClick={() => setPlayingVideo(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <iframe
                src={playingVideo.type === 'video' 
                  ? `https://www.youtube.com/embed/${playingVideo.id}?autoplay=1`
                  : `https://www.youtube.com/embed/videoseries?list=${playingVideo.id}&autoplay=1`
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
