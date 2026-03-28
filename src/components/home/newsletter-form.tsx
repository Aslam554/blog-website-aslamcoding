"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    const formData = new FormData();
    formData.append("email", email);

    try {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setStatus("success");
        setMessage(result.success);
        setEmail("");
        toast.success(result.success);
      } else {
        setStatus("error");
        setMessage(result.error || "Failed to subscribe");
        toast.error(result.error);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      toast.error("Internal server error");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-10" />
      
      <div className="max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[48px] p-10 md:p-20 text-center space-y-10 border-none bg-background/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden group"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 p-12 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Join the Elite Coding Squad
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-foreground">
              Level Up Your <span className="text-primary italic">Dev Game</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Get the latest &quot;zero-to-hero&quot; tutorials, coding tips, and industry insights delivered straight to your inbox. No spam, just pure alpha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto z-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <Input
                type="email"
                placeholder="Enter your professional email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-20 pl-16 pr-44 rounded-full bg-muted/30 border-none focus-visible:ring-primary/20 text-xl font-bold transition-all shadow-inner"
              />
              <div className="absolute inset-y-3 right-3 flex items-center">
                <Button 
                  type="submit" 
                  disabled={status === "loading" || status === "success"}
                  className="h-14 px-10 rounded-full bg-primary text-white font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:translate-y-[-2px] transition-all gap-3 text-lg"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : status === "success" ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {status === "success" && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 font-black text-sm relative z-10"
                >
                    {message}
                </motion.p>
            )}
            {status === "error" && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 font-black text-sm relative z-10"
                >
                    {message}
                </motion.p>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 relative z-10">
            By subscribing, you agree to our <span className="underline cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>. 
          </p>
        </motion.div>
      </div>
    </section>
  );
}
