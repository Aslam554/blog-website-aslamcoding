"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Code2, Globe, Laptop, Calendar, Trash2, Layout } from "lucide-react";
import { format } from "date-fns";
import AddLogModal from "./add-log-modal";
import { deleteTrackerLog } from "@/actions/tracker";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface Log {
  id: string;
  date: Date;
  leetcodeCount: number;
  codeforcesCount: number;
  devProgress: string | null;
  description: string | null;
}

interface Tracker {
  id: string;
  title: string;
  description: string | null;
  logs: Log[];
}

export default function TrackerOverview({ trackers }: { trackers: any[] }) {
  if (trackers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[40px] border-none bg-background/40 backdrop-blur-xl">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Layout className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-outfit font-bold mb-2">No Trackers Found</h2>
        <p className="text-muted-foreground font-medium text-lg max-w-md text-center">
          You haven't created any coding trackers yet. Start by creating one to stay consistent on your journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {trackers.map((tracker, idx) => {
        const totalLeetCode = tracker.logs.reduce((sum: number, log: any) => sum + log.leetcodeCount, 0);
        const totalCodeforces = tracker.logs.reduce((sum: number, log: any) => sum + log.codeforcesCount, 0);
        const logCount = tracker.logs.length;

        return (
          <motion.div
            key={tracker.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-8"
          >
            {/* Tracker Header & Stats */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 glass-card rounded-[40px] p-8 space-y-6 bg-background/40 backdrop-blur-2xl border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="space-y-4">
                    <h2 className="text-3xl font-outfit font-bold tracking-tight">{tracker.title}</h2>
                    <p className="text-muted-foreground font-medium line-clamp-2">{tracker.description || "Consistent daily tracking for your growth."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-primary/10 border border-primary/10 text-primary">
                        <p className="text-xs font-black uppercase tracking-tight opacity-60 mb-1">Total LeetCode</p>
                        <p className="text-2xl font-black">{totalLeetCode}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/10 text-purple-600">
                        <p className="text-xs font-black uppercase tracking-tight opacity-60 mb-1">Total Codeforces</p>
                        <p className="text-2xl font-black">{totalCodeforces}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/10 text-blue-600">
                        <p className="text-xs font-black uppercase tracking-tight opacity-60 mb-1">Days Logged</p>
                        <p className="text-2xl font-black">{logCount}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-green-500/10 border border-green-500/10 text-green-600">
                        <p className="text-xs font-black uppercase tracking-tight opacity-60 mb-1">Consistency</p>
                        <p className="text-2xl font-black">{Math.min(100, logCount * 5)}%</p>
                    </div>
                </div>

                <AddLogModal trackerId={tracker.id} />
              </div>

              {/* Logs Timeline */}
              <div className="lg:w-2/3 space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-xl font-outfit font-bold flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" /> Recent Activity
                    </h3>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide py-2">
                    {tracker.logs.length === 0 ? (
                        <div className="p-12 text-center rounded-[32px] border-2 border-dashed border-border/50 bg-muted/5">
                            <p className="text-muted-foreground font-bold">No progress logged yet. Put in some work and log it!</p>
                        </div>
                    ) : (
                        tracker.logs.map((log: any) => (
                            <div key={log.id} className="glass-card rounded-[32px] p-6 border-none bg-background/40 backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-black uppercase tracking-widest text-primary">
                                            {format(new Date(log.date), "MMMM d, yyyy")}
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                            onClick={async () => {
                                                const res = await deleteTrackerLog(log.id);
                                                if (res.success) toast.success(res.success);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(log.leetcodeCount > 0) && (
                                            <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10 font-bold text-sm">
                                                <Code2 className="h-4 w-4 text-primary" /> {log.leetcodeCount} LeetCode
                                            </div>
                                        )}
                                        {(log.codeforcesCount > 0) && (
                                            <div className="flex items-center gap-3 bg-purple-500/5 px-4 py-2 rounded-2xl border border-purple-500/10 font-bold text-sm">
                                                <Globe className="h-4 w-4 text-purple-500" /> {log.codeforcesCount} Codeforces
                                            </div>
                                        )}
                                        {log.devProgress && (
                                            <div className="flex items-center gap-3 bg-blue-500/5 px-4 py-2 rounded-2xl border border-blue-500/10 font-bold text-sm col-span-full md:col-span-1">
                                                <Laptop className="h-4 w-4 text-blue-500" /> Dev: {log.devProgress}
                                            </div>
                                        )}
                                    </div>

                                    {log.description && (
                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                            "{log.description}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
