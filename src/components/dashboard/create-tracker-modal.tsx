"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createTracker } from "@/actions/tracker";
import { toast } from "sonner";

export default function CreateTrackerModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createTracker(formData);
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-2">
          <Plus className="h-6 w-6" />
          Create New Tracker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] glass-card border-none bg-background/95 backdrop-blur-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-outfit font-bold tracking-tight">Setup Your <span className="gradient-text">Mastery Tracker</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Tracker Title</label>
            <Input 
              name="title" 
              placeholder="e.g., DSA Mastery 2025" 
              className="h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-bold"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Description (Optional)</label>
            <Textarea 
              name="description" 
              placeholder="What are your goals for this tracker?" 
              className="min-h-[120px] rounded-2xl bg-muted/30 border-none focus:ring-primary/20 font-medium resize-none p-4"
            />
          </div>
          <Button 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Bootstrap Tracker"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
