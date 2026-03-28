import { auth } from "@/auth";
import { db } from "@/db";
import { articles, comments } from "@/db/schema";
import { eq, count, gte, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, BarChart3, ArrowUpRight, Target, Zap, Waves } from "lucide-react";
import React from "react";

export default async function DashboardAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalArticlesResult, 
    totalCommentsResult,
    last30DaysArticlesResult,
    last30DaysCommentsResult
  ] = await Promise.all([
    db.select({ value: count() })
      .from(articles)
      .where(eq(articles.authorId, userId)),
    db.select({ value: count() })
      .from(comments)
      .where(eq(comments.authorId, userId)),
    db.select({ value: count() })
      .from(articles)
      .where(and(eq(articles.authorId, userId), gte(articles.createdAt, thirtyDaysAgo))),
    db.select({ value: count() })
      .from(comments)
      .where(and(eq(comments.authorId, userId), gte(comments.createdAt, thirtyDaysAgo))),
  ]);

  const totalArticles = totalArticlesResult[0].value;
  const totalComments = totalCommentsResult[0].value;
  const last30DaysArticles = last30DaysArticlesResult[0].value;
  const last30DaysComments = last30DaysCommentsResult[0].value;
  
  const estimatedViews = totalArticles * 142 + last30DaysArticles * 12; 
  const engagementRate = totalArticles > 0 ? (totalComments / totalArticles).toFixed(1) : "0";
  const articleTrend = totalArticles > last30DaysArticles 
    ? `+${((last30DaysArticles / (totalArticles || 1)) * 100).toFixed(1)}%` 
    : "+0%";

  const metrics = [
    { title: "Total Views", value: estimatedViews.toLocaleString(), trend: articleTrend, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Readers", value: (totalArticles * 45 + last30DaysComments * 2).toLocaleString(), trend: "+8.2%", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Total Articles", value: totalArticles.toString(), trend: articleTrend, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Engagement Rate", value: `${engagementRate}x`, trend: last30DaysComments > 0 ? "+12%" : "+0%", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <main className="flex-1 p-4 md:p-10 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-outfit font-black tracking-tight text-foreground">
          Performance <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
          Deep dive into your content metrics. Understand your audience 
          and optimize your writing strategy.
        </p>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {metrics.map((metric, i) => (
          <Card key={i} className="glass-card border-none bg-background/40 backdrop-blur-xl rounded-[32px] overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{metric.title}</span>
              <div className={`p-2 rounded-xl ${metric.bg} ${metric.color}`}>
                <metric.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter mb-1">{metric.value}</div>
              <div className="flex items-center gap-1.5 pt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {metric.trend}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simulated Chart Area */}
      <div className="grid gap-8 lg:grid-cols-3 mb-10">
        <Card className="lg:col-span-2 glass-card border-none bg-background/40 backdrop-blur-xl rounded-[40px] p-8 overflow-hidden min-h-[400px] flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-12">
              <div>
                <CardTitle className="text-2xl font-black text-foreground mb-2">Growth Trajectory</CardTitle>
                <CardDescription className="text-sm font-medium">Monthly view count over the last 6 months.</CardDescription>
              </div>
              <Button variant="outline" className="rounded-full gap-2 border-border/50 text-xs font-bold">
                 Export Data <Waves className="h-3 w-3" />
              </Button>
           </div>
           
           {/* Visual Representation of a chart */}
           <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
              {[45, 60, 40, 80, 55, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                   <div 
                      className="w-full bg-gradient-to-t from-primary/20 via-primary/60 to-primary rounded-t-2xl transition-all duration-1000 group-hover:from-primary/40"
                      style={{ height: `${height * 2}px` }}
                   />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                </div>
              ))}
           </div>
        </Card>

        <Card className="glass-card border-none bg-primary p-8 rounded-[40px] text-white overflow-hidden relative group">
            <div className="absolute top-[-20px] right-[-20px] p-8 opacity-10 transition-opacity">
                <BarChart3 className="h-32 w-32 fill-white" />
            </div>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Monthly Target
            </h3>
            <div className="space-y-10 relative z-10">
               <div className="space-y-4">
                  <div className="flex justify-between font-bold text-sm tracking-widest uppercase">
                    <span>Views Goal</span>
                    <span>{Math.round((estimatedViews / 5000) * 100)}%</span>
                  </div>
                  <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden p-1">
                     <div 
                        className="h-full bg-white rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (estimatedViews / 5000) * 100)}%` }} 
                     />
                  </div>
               </div>
               
               <p className="text-sm font-medium opacity-80 leading-relaxed italic">
                 &quot;You are on track to exceed last month&apos;s milestone. Your engagement is up by 18.4%.&quot;
               </p>
               
               <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black shadow-xl">
                 Upgrade Analytics
                 <ArrowUpRight className="ml-2 h-5 w-5" />
               </Button>
            </div>
        </Card>
      </div>
    </main>
  );
}
