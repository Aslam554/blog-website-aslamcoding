"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PremiumBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-50, 50, -50],
          y: [-50, 50, -50]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-primary/20 blur-[130px]" 
      />
      
      {/* Secondary Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [50, -50, 50],
          y: [50, -50, 50]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-purple-500/15 blur-[130px]" 
      />

      {/* Center Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1000px] w-[1000px] rounded-full bg-blue-500/5 blur-[160px]" />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            x: Math.random() * 2000 - 1000, 
            y: Math.random() * 2000 - 1000 
          }}
          animate={{ 
            opacity: [0, 0.3, 0],
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 10, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-2 h-2 rounded-full bg-primary/40 blur-[2px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
