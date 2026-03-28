import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Shield, Bell, Zap, Globe, Lock, Trash2 } from "lucide-react";
import React from "react";
import SettingsForm from "@/components/dashboard/settings-form";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <main className="flex-1 p-4 md:p-10 bg-background relative overflow-hidden font-outfit">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Profile <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
          Manage your personal information, security preferences, and integration settings.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left Column: Navigation/Profile Summary */}
        <div className="space-y-8 lg:col-span-1">
           <Card className="glass-card border-none bg-background/40 backdrop-blur-xl rounded-[40px] p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
              <div className="relative mb-6">
                 <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-2xl relative z-10">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                 </Avatar>
                 <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2" />
              </div>
              <h3 className="text-2xl font-black mb-1">{user?.name}</h3>
              <p className="text-sm font-medium text-muted-foreground mb-6">{user?.email}</p>
              
              <div className="space-y-3 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 bg-primary/5 text-primary">
                   <User className="h-4 w-4" /> Personal Info
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 hover:bg-primary/5 hover:text-primary transition-all">
                   <Shield className="h-4 w-4" /> Security
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 hover:bg-primary/5 hover:text-primary transition-all">
                   <Bell className="h-4 w-4" /> Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12 hover:bg-primary/5 hover:text-primary transition-all font-bold">
                   <Zap className="h-4 w-4" /> AI Preferences
                </Button>
              </div>
           </Card>

           <Card className="glass-card border-none bg-primary/5 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] p-8 opacity-10 transition-opacity">
                <Globe className="h-24 w-24 fill-primary" />
              </div>
              <h4 className="text-xl font-black mb-4 flex items-center gap-2">Public Profile</h4>
              <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                Your profile is currently public and visible to all readers on the platform.
              </p>
              <Button variant="outline" className="w-full rounded-2xl h-12 glass border-primary/20 hover:bg-primary hover:text-white transition-all font-bold">
                View Public Page
              </Button>
           </Card>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2 space-y-8 text-foreground font-medium">
           <Card className="glass-card border-none bg-background/40 backdrop-blur-xl rounded-[40px] p-10">
              <SettingsForm user={user} />
           </Card>

           <Card className="glass-card border-none bg-background/40 backdrop-blur-xl rounded-[40px] p-10 space-y-8 border border-red-500/10">
              <div className="flex items-center gap-4 text-destructive">
                 <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-extrabold">Advanced Controls</h3>
                    <p className="text-sm font-medium opacity-80">Manage high-security account actions.</p>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-destructive/5 border border-destructive/10">
                 <div>
                    <h4 className="font-bold text-foreground">Terminate Account</h4>
                    <p className="text-xs text-muted-foreground">Permanently delete all your data and published articles.</p>
                 </div>
                 <Button variant="ghost" className="h-12 px-6 rounded-xl text-destructive hover:bg-destructive/10 font-bold gap-2">
                    <Trash2 className="h-4 w-4" /> Delete Forever
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </main>
  );
}
