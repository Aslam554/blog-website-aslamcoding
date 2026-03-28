"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
}

interface YouTubeSliderProps {
  videos: Video[];
}

export default function YouTubeSlider({ videos }: YouTubeSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
       <div className="absolute top-0 right-[-10%] h-[600px] w-[600px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
       <div className="absolute bottom-0 left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 mb-16 flex items-end justify-between relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
              <Youtube className="h-4 w-4" />
              <span>Latest Tutorials</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-outfit font-black tracking-tight text-foreground">
            Learn with <span className="text-red-500 italic">Aslam Coding</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg font-medium opacity-80">
            Watch the newest technical deep dives, problem-solving techniques, and full-stack project builds.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-14 w-14 glass border-border/50 hover:bg-muted/50 transition-all shadow-xl" onClick={scrollLeft}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-14 w-14 glass border-border/50 hover:bg-muted/50 transition-all shadow-xl" onClick={scrollRight}>
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
      </div>

      <div className="w-full relative px-4 md:px-8 z-10">
        <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 snap-x snap-mandatory scrollbar-hide py-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.slice(0, 9).map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[85vw] md:min-w-[calc(33.333%-1.5rem)] snap-center group select-none"
            >
              <a 
                href={`https://youtube.com/watch?v=${video.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative glass-card rounded-[40px] overflow-hidden border-none bg-background/40 backdrop-blur-xl hover:translate-y-[-8px] transition-all duration-500 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] h-full flex flex-col group"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image 
                        src={video.thumbnail} 
                        alt={video.title} 
                        fill 
                        sizes="(max-width: 768px) 85vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                        <div className="h-20 w-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 ring-4 ring-white/20">
                            <Play className="h-8 w-8 ml-1" fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-3">
                    <h3 className="font-outfit font-bold text-xl line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-auto font-medium leading-relaxed">
                        {video.description || "Watch this latest tutorial to level up your development skills."}
                    </p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
