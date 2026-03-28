"use client";

import React from "react";
import { motion } from "framer-motion";
import { Youtube, MessageCircle, ArrowUpRight, Users, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SocialPromo() {
  const socialConfig = [
    {
      name: "YouTube",
      handle: "@aslamcoding",
      title: "Master Code with Visuals",
      description: "Step-by-step tutorials from pure basics to advanced full-stack mastery. Subscribe to the elite coding squad.",
      icon: <Youtube className="h-8 w-8 text-[#FF0000]" />,
      actionText: "Subscribe Now",
      link: "https://youtube.com/@aslamcoding",
      color: "from-[#FF0000]/10 to-[#FF0000]/5",
      borderColor: "border-[#FF0000]/20",
      stats: "320+ Tutorials",
      hoverIcon: <Bell className="h-4 w-4" />
    },
    {
        name: "WhatsApp",
        handle: "Resource Hub",
        title: "Exclusive Dev Assets",
        description: "Get daily source codes, premium roadmaps, and industry job alerts. Join 5,000+ developers today.",
        icon: <MessageCircle className="h-8 w-8 text-[#25D366]" />,
        actionText: "Join Channel",
        link: "https://whatsapp.com/channel/0029Vb7py7aJ93wUaC7dJb0Z",
        color: "from-[#25D366]/10 to-[#25D366]/5",
        borderColor: "border-[#25D366]/20",
        stats: "Community for All",
        hoverIcon: <Users className="h-4 w-4" />
      }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {socialConfig.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`glass rounded-[40px] p-8 md:p-12 border ${item.borderColor} relative group overflow-hidden bg-gradient-to-br ${item.color}`}
            >
              {/* Animated Background Element */}
              <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors duration-700 -z-10" />

              <div className="flex items-start justify-between mb-8">
                <div className="p-5 rounded-2xl glass border-white/10 shadow-lg">
                  {item.icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{item.name}</span>
                    <span className="text-foreground font-extrabold text-sm">{item.handle}</span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-3xl font-outfit font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.stats}</span>
                </div>
                
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-full px-8 py-6 h-auto bg-foreground text-background font-bold shadow-xl hover:bg-primary hover:text-white transition-all transform group-hover:scale-105 gap-2">
                    {item.actionText}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>

              {/* Decorative Sparkle */}
              <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                 <Sparkles className="h-24 w-24 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
