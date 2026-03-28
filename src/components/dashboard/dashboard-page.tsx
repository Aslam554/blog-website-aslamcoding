import { FileText, MessageCircle, PlusCircle, Clock, TrendingUp, Users, ArrowUpRight, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecentArticles from "./recent-articles";
import { db } from "@/db";
import { articles as articlesTable, comments } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function BlogDashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  const [recentArticles, totalArticlesResult, totalCommentsResult] = await Promise.all([
    db.query.articles.findMany({
      where: eq(articlesTable.authorId, userId),
      orderBy: [desc(articlesTable.createdAt)],
      limit: 10,
      with: {
        comments: true,
        author: {
          columns: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    }),
    db.select({ value: count() })
      .from(articlesTable)
      .where(eq(articlesTable.authorId, userId)),
    db.select({ value: count() })
      .from(comments)
      .where(eq(comments.authorId, userId)),
  ]);

  const totalArticles = totalArticlesResult[0].value;
  const totalComments = totalCommentsResult[0].value;

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      icon: FileText,
      trend: "+12%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      info: "Articles published so far"
    },
    {
      title: "Total Comments",
      value: totalComments,
      icon: MessageCircle,
      trend: "+8",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      info: "Comments received across all posts"
    },
    {
      title: "Active Readers",
      value: Math.floor(totalArticles * 12.5), // Simulated for UI
      icon: Users,
      trend: "+24%",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      info: "Unique readers this month"
    },
  ];

  return (
    <main className="flex-1 min-h-screen p-4 md:p-10 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Admin Portal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold tracking-tight text-foreground">
            Hi, <span className="gradient-text italic">{session.user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-lg leading-relaxed">
            Your personal space to manage content, track performance, and write your next viral article.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href={"/dashboard/articles/create"} className="w-full sm:w-auto">
            <Button className="h-14 px-10 rounded-3xl gap-3 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:translate-y-[-4px] transition-all duration-300 font-bold text-lg group">
              <PlusCircle className="h-6 w-6 transition-transform group-hover:rotate-90" />
              Create Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-8 md:grid-cols-3 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card group relative border-none overflow-hidden hover:translate-y-[-8px] transition-all duration-500 bg-background/40 backdrop-blur-xl">
            <div className={`absolute top-0 right-0 p-8 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
              <stat.icon className="h-32 w-32" />
            </div>
            
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-outfit font-black tracking-tighter mb-2">{stat.value}</div>
              <div className="flex items-center justify-between mt-6">
                 <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stat.trend} increase
                </p>
                <Link href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View details <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="lg:col-span-3 space-y-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="h-10 w-1.5 bg-primary rounded-full shadow-lg shadow-primary/40" />
                <h2 className="text-3xl font-outfit font-bold tracking-tight">Recent Publications</h2>
              </div>
              <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                Last 30 days <Clock className="h-4 w-4" />
              </Button>
           </div>
           <RecentArticles articles={recentArticles} />
        </div>

        {/* Sidebar Mini-Stats Column */}
        <div className="space-y-8">
           <Card className="glass-card border-none bg-primary/5 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap className="h-24 w-24 fill-primary text-primary" />
              </div>
              <h3 className="text-xl font-outfit font-bold mb-4">AI Assistant</h3>
              <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                Need a new topic? Let AI suggest the next big thing based on your niche.
              </p>
              <Link href="/dashboard/articles/create">
                <Button className="w-full rounded-2xl h-12 bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold group">
                  Try AI Writer
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </Link>
           </Card>

           <Card className="glass-card border-none p-8 rounded-[40px] bg-purple-500/5">
              <h3 className="text-xl font-outfit font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Monthly Goal
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2 px-1">
                    <span>Article Consistency</span>
                    <span>{Math.round((totalArticles / 10) * 100)}%</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-purple-500/10">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-primary rounded-full transition-all duration-1000 shadow-lg shadow-purple-500/20" 
                      style={{ width: `${Math.min(100, (totalArticles / 10) * 100)}%` }} 
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium italic">
                  * Target is 10 articles this month. Keep it up!
                </p>
              </div>
           </Card>
        </div>
      </div>
    </main>
  );
}
