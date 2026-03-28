"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Code2, 
  TerminalSquare, 
  BrainCircuit, 
  Briefcase, 
  Video 
} from "lucide-react";

export default function CategoryShowcase() {
  const categories = [
    {
      title: "DSA & Problem Solving",
      description: "Master algorithms, crack LeetCode patterns, and build a strong foundation.",
      icon: <TerminalSquare className="h-8 w-8 text-blue-500" />,
      color: "from-blue-500/10 to-blue-500/5",
      borderColor: "border-blue-500/20",
      href: "/articles?category=dsa",
      span: "md:col-span-2"
    },
    {
      title: "Full Stack Web Dev",
      description: "Build modern, scalable applications from UI to database.",
      icon: <Code2 className="h-8 w-8 text-green-500" />,
      color: "from-green-500/10 to-green-500/5",
      borderColor: "border-green-500/20",
      href: "/articles?category=webdev",
      span: "md:col-span-1"
    },
    {
      title: "AI & Tech Trends",
      description: "Stay ahead with applied AI, emerging tools, and industry shifts.",
      icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
      color: "from-purple-500/10 to-purple-500/5",
      borderColor: "border-purple-500/20",
      href: "/articles?category=ai",
      span: "md:col-span-1"
    },
    {
        title: "Placements & Freelance",
        description: "Actionable tips for bagging offers and growing your freelance business.",
        icon: <Briefcase className="h-8 w-8 text-orange-500" />,
        color: "from-orange-500/10 to-orange-500/5",
        borderColor: "border-orange-500/20",
        href: "/articles?category=career",
        span: "md:col-span-1"
    },
    {
        title: "Vlogs & Motivation",
        description: "Behind the scenes of developer life, study routines, and inspiration.",
        icon: <Video className="h-8 w-8 text-rose-500" />,
        color: "from-rose-500/10 to-rose-500/5",
        borderColor: "border-rose-500/20",
        href: "/tutorials", // Linking to video hub
        span: "md:col-span-1"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
               <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
                 Explore by <span className="gradient-text">Category</span>
               </h2>
               <p className="text-muted-foreground max-w-xl text-lg font-medium">
                 Whether you're grinding LeetCode or building your first SaaS, pick a path to start learning.
               </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link href={category.href} key={category.title} className={category.span}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`h-full relative group rounded-3xl p-8 transition-all duration-500 glass border ${category.borderColor} bg-gradient-to-br ${category.color} hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer overflow-hidden`}
              >
                {/* Background Glow */}
                <div className="absolute -right-8 -bottom-8 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl">
                    {category.icon}
                </div>

                <div className="p-4 rounded-full glass border-white/10 shadow-lg inline-flex mb-8 group-hover:scale-110 transition-transform duration-500">
                  {category.icon}
                </div>
                
                <h3 className="text-2xl font-outfit font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
