"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlaySquare, Layers, ArrowRight, Code2 } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  description: string;
}

interface PopularCoursesProps {
  playlists: Playlist[];
}

export default function PopularCourses({ playlists }: PopularCoursesProps) {
  if (!playlists || playlists.length === 0) return null;

  // Find Leetcode playlist specifically or just take the first few
  const leetcodePlaylist = playlists.find(p => p.title.toLowerCase().includes("leetcode"));
  const otherPlaylists = playlists.filter(p => p.id !== leetcodePlaylist?.id).slice(0, 2);
  
  const displayPlaylists = leetcodePlaylist ? [leetcodePlaylist, ...otherPlaylists] : playlists.slice(0, 3);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-[30%] left-[-5%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Layers className="h-4 w-4" />
              <span>Structured Learning</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-outfit font-black tracking-tight text-foreground">
            Popular <span className="gradient-text">Courses</span> & Series
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium opacity-80">
            Dive deep into curated playlists designed to take you from a beginner to an advanced problem solver.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {displayPlaylists.map((playlist, idx) => {
            const isFeatured = idx === 0 && playlist.title.toLowerCase().includes("leetcode");
            
            return (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative group rounded-[48px] p-2 transition-all duration-500 ${
                  isFeatured 
                    ? "lg:col-span-3 glass-card border-none bg-background/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.1)] p-4 ring-1 ring-primary/20" 
                    : "glass-card border-none bg-background/40 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-4"
                }`}
              >
                {isFeatured && (
                   <div className="absolute -top-4 -right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-2.5 rounded-full shadow-2xl shadow-primary/40 rotate-6 z-20 border-4 border-background">
                     Highly Recommended
                   </div>
                )}
                
                <a 
                  href={`https://youtube.com/playlist?list=${playlist.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex flex-col ${isFeatured ? "md:flex-row items-stretch gap-10" : "gap-8"} h-full`}
                >
                  <div className={`relative rounded-[36px] overflow-hidden ${isFeatured ? "w-full md:w-[45%] aspect-video" : "w-full aspect-video"} shadow-inner`}>
                      <Image 
                          src={playlist.thumbnail} 
                          alt={playlist.title} 
                          fill 
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                      <div className="absolute inset-x-0 bottom-0 p-6 flex items-end">
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-black shadow-xl">
                            <PlaySquare className="h-4 w-4 text-primary" />
                            {playlist.videoCount} Masterclasses
                        </div>
                      </div>
                  </div>

                  <div className={`flex flex-col flex-1 ${isFeatured ? "py-6 md:pr-10" : "pb-4"}`}>
                      {isFeatured && (
                          <div className="flex items-center gap-3 text-primary mb-6 font-black tracking-widest uppercase text-[10px]">
                              <Code2 className="h-5 w-5 bg-primary/10 p-1 rounded-lg" /> Comprehensive Career Roadmap
                          </div>
                      )}
                      
                      <h3 className={`font-outfit font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight ${isFeatured ? "text-3xl md:text-5xl mb-6" : "text-2xl mb-4"}`}>
                          {playlist.title}
                      </h3>
                      
                      <p className={`text-muted-foreground line-clamp-3 mb-8 font-medium leading-relaxed ${isFeatured ? "text-xl" : "text-sm"}`}>
                          {playlist.description || "Master the concepts with our curated playlist. Step-by-step guidance tailored for developers."}
                      </p>
    
                      <div className="mt-auto inline-flex items-center gap-4 text-primary font-black uppercase tracking-tighter text-sm group-hover:translate-x-3 transition-transform duration-500">
                          Start Your Journey <ArrowRight className="h-5 w-5" />
                      </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
