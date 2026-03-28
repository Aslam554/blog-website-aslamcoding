"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, Code2, Globe, Laptop, Sparkles } from "lucide-react";
import { addTrackerLog } from "@/actions/tracker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AddLogModal({ trackerId }: { trackerId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("trackerId", trackerId);
    
    try {
      const res = await addTrackerLog(formData);
      if (res.success) {
        setShowSuccess(true);
        toast.success(res.success);
        setTimeout(() => {
          setOpen(false);
          setShowSuccess(false);
        }, 1500);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl h-12 glass border-primary/20 hover:bg-primary/10 transition-all gap-2 font-bold">
          <PlusCircle className="h-5 w-5 text-primary" />
          Log Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] rounded-[32px] glass-card border-none bg-background/95 backdrop-blur-3xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-3xl font-outfit font-bold tracking-tight">Record Daily <span className="gradient-text">Wins</span></DialogTitle>
        </DialogHeader>
        <div className="relative">
          <form onSubmit={handleSubmit} className={cn("space-y-6 pt-4 transition-all duration-500", showSuccess && "opacity-0 scale-95 pointer-events-none")}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Code2 className="h-3 w-3 text-primary" /> LeetCode
                  </label>
                  <Input 
                      name="leetcodeCount" 
                      type="number" 
                      placeholder="0"
                      className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-bold"
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Globe className="h-3 w-3 text-purple-500" /> Codeforces
                  </label>
                  <Input 
                      name="codeforcesCount" 
                      type="number" 
                      placeholder="0"
                      className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-bold"
                  />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Laptop className="h-3 w-3 text-blue-500" /> Development Progress
              </label>
              <Input 
                name="devProgress" 
                placeholder="e.g., Finished Authentication module" 
                className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Summary</label>
              <Textarea 
                name="description" 
                placeholder="Tell us more about your coding journey today..." 
                className="min-h-[100px] rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-medium resize-none p-4"
              />
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Progress"}
            </Button>
          </form>

          {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center z-50 py-12"
              >
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 15, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20"
                  >
                    <Sparkles className="h-12 w-12 text-primary" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-outfit font-bold tracking-tight">Progress Saved!</h3>
                    <p className="text-muted-foreground font-medium text-lg italic">"Consistency is the key to mastery."</p>
                  </div>
                </div>
              </motion.div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
