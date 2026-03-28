"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, MousePointer2 } from "lucide-react";

import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              <span>Your Developer Journey Starts Here</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-outfit font-black tracking-tight leading-[1.1]"
            >
              Master Coding, <br />
              Crack Placements & <br />
              <span className="gradient-text italic text-6xl md:text-8xl">Build the Future.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground leading-relaxed font-medium"
            >
              Join the Aslam Coding ecosystem. Dive into deep technical tutorials, master DSA, navigate the freelance world, and get inspired by developer vlogs.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
            >
              <Link href="/tutorials">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:translate-y-[-4px] transition-all duration-300 font-black group">
                  Start Learning
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/tutorials/roadmaps">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 h-16 text-lg glass border-border/50 hover:bg-muted/50 transition-all duration-300 font-bold tracking-tight"
                >
                  View Roadmaps
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-12 pt-12"
            >
              {[
                { label: "Videos", value: "700+" },
                { label: "DSA Problems", value: "1.5k+" },
                { label: "Subscribers", value: "50k+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold font-outfit text-foreground">{stat.value}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto h-[500px]"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[40px] blur-3xl animate-pulse" />
             <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl skew-y-3 group hover:skew-y-0 transition-all duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                  alt="Premium Workspace"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                
                {/* Floating Elements */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-10 right-10 glass p-5 rounded-2xl shadow-xl flex items-center gap-4"
                >
                   <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <MousePointer2 className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-tight opacity-60">Trending</span>
                      <span className="text-sm font-bold">Future of AI</span>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
