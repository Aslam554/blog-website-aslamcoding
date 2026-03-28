import React from "react";
import TrackerOverview from "@/components/dashboard/tracker-overview";
import { getTrackers } from "@/actions/tracker";
import { TrendingUp } from "lucide-react";
import CreateTrackerModal from "@/components/dashboard/create-tracker-modal";

export default async function TrackerPage() {
  const trackersData = await getTrackers();

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" />
            <span>Growth Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground">
            Daily <span className="gradient-text">Progress</span> Tracker
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Monitor your coding journey, DSA consistency, and project development.
          </p>
        </div>

        <CreateTrackerModal />
      </div>

      <TrackerOverview trackers={trackersData} />
    </div>
  );
}
