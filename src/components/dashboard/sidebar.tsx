"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  BarChart,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
  PlusCircle,
  TrendingUp,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 rounded-xl glass border-border/50 shadow-xl"
          >
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 border-r-0 bg-background/95 backdrop-blur-xl">
          <DashboardSidebar closeSheet={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen w-[280px] border-r border-border/50 bg-background/50 backdrop-blur-md">
        <DashboardSidebar />
      </div>
    </div>
  );
};

export default Sidebar;

function DashboardSidebar({ closeSheet }: { closeSheet?: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Create Article", icon: PlusCircle, href: "/dashboard/articles/create" },
    { name: "My Content", icon: FileText, href: "/dashboard" },
    { name: "Daily Tracker", icon: TrendingUp, href: "/dashboard/tracker" },
    { name: "Comments", icon: MessageCircle, href: "/dashboard/comments" },
    { name: "Analytics", icon: BarChart, href: "/dashboard/analytics" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex flex-col h-full py-8">
      {/* Logo Section */}
      <div className="px-8 mb-12">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-outfit font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              &lt; Aslam
            </span>
            <span className="text-foreground transition-colors group-hover:text-primary">Coding /&gt;</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={closeSheet}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 rounded-2xl gap-3 px-4 font-semibold transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-primary")} />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 mt-auto space-y-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 px-1">Pro Feature</p>
          <p className="text-sm font-medium text-foreground mb-3 px-1">Unlock AI Article Generation & SEO Analytics</p>
          <Button variant="outline" className="w-full text-xs font-bold rounded-2xl glass border-primary/20 hover:bg-primary hover:text-white transition-all">
            Upgrade Plan
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full justify-start h-12 rounded-2xl gap-3 px-4 font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
