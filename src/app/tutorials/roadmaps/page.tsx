"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  ChevronRight, 
  Map as MapIcon, 
  Sparkles, 
  Rocket, 
  Target, 
  ArrowLeft,
  Layers,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RoadmapTree from "@/components/tutorials/roadmap-tree";
import { fullstackRoadmap } from "@/data/roadmaps";

export default function RoadmapsPage() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/tutorials">
            <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Tutorials
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <div className="text-center space-y-6 mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5"
          >
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Learning Paths</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-outfit font-extrabold tracking-tight text-foreground"
          >
            Interactive <span className="gradient-text">Roadmaps</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Don't just code. Build a structured path to mastery with our battle-tested curriculum designed for modern engineering.
          </motion.p>
        </div>

        {/* Roadmap Display Section */}
        <div className="space-y-32">
          {/* Main Roadmap */}
          <section className="relative">
            <div className="mb-12 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-outfit font-bold flex items-center gap-3">
                        <Rocket className="h-8 w-8 text-primary" />
                        Fullstack Mastery v1.0
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">The comprehensive path from frontend fundamentals to advanced systems design.</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        84 Lessons
                    </div>
                </div>
            </div>

            <div className="relative glass rounded-[48px] border border-white/5 bg-black/5 shadow-2xl p-12 min-h-[900px] flex items-center justify-center overflow-x-auto scrollbar-hide">
              <RoadmapTree nodes={fullstackRoadmap} />
            </div>
          </section>

          {/* More Coming Soon */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { title: "Backend Systems", icon: <Layers />, tag: "Upcoming" },
                { title: "DevOps Excellence", icon: <Terminal />, tag: "Researching" },
                { title: "AI Engineering", icon: <Sparkles />, tag: "Coming Soon" }
            ].map((card, idx) => (
                <div key={idx} className="glass p-8 rounded-[32px] border border-white/5 hover:border-primary/20 transition-all group cursor-not-allowed">
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 rounded-2xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            {React.cloneElement(card.icon as React.ReactElement<any>, { className: "h-6 w-6" })}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{card.tag}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Coming soon to help you master {card.title.toLowerCase()}.</p>
                </div>
            ))}
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </main>
  );
}
