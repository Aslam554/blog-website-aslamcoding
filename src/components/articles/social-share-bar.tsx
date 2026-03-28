"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Link as LinkIcon, 
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SocialShareBarProps {
  title: string;
  url: string;
}

export default function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [mounted, setMounted] = React.useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use the provided URL if available, otherwise get current location (only after mount)
  const shareUrl = mounted ? (url || window.location.href) : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "X",
      icon: <Twitter className="h-5 w-5" />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-black hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25d366] hover:text-white",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Desktop Vertical Bar */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
        <div className="flex flex-col items-center gap-2 mb-4">
            <div className="h-10 w-[2px] bg-gradient-to-t from-primary/50 to-transparent" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">Share</span>
        </div>
        
        {shareLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "h-12 w-12 rounded-2xl glass flex items-center justify-center text-muted-foreground transition-all duration-300 border border-white/10 shadow-lg",
              link.color
            )}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </motion.a>
        ))}

        <motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "h-12 w-12 rounded-2xl glass flex items-center justify-center text-muted-foreground transition-all duration-300 border border-white/10 shadow-lg hover:bg-primary hover:text-white",
            copied && "bg-green-500 text-white"
          )}
          title="Copy Link"
        >
          {copied ? <Check className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Mobile Horizontal Bar (Sticky Bottom) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-xs">
        <div className="glass rounded-full border border-white/20 shadow-2xl p-2 flex items-center justify-around">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-primary transition-colors"
            >
              {React.cloneElement(link.icon as React.ReactElement<{ className: string }>, { className: "h-6 w-6" })}
            </a>
          ))}
          <button
            onClick={copyToClipboard}
            className={cn(
              "p-3 rounded-full transition-all",
              copied ? "bg-green-500 text-white" : "text-muted-foreground hover:text-primary"
            )}
          >
            {copied ? <Check className="h-6 w-6" /> : <LinkIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </>
  );
}
