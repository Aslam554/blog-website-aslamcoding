import { auth } from "@/auth";
import { db } from "@/db";
import { articles, comments } from "@/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink, Calendar, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import DeleteCommentButton from "@/components/dashboard/delete-comment-button";

export default async function DashboardCommentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch comments for all articles belonging to this author using a subquery
  const userComments = await db.query.comments.findMany({
    where: (comment, { inArray, eq }) => {
      return inArray(
        comment.articleId,
        db.select({ id: articles.id }).from(articles).where(eq(articles.authorId, userId))
      );
    },
    with: {
      author: true,
      article: true,
    },
    orderBy: [desc(comments.createdAt)],
  });

  return (
    <main className="flex-1 p-4 md:p-10 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] -z-10" />
      
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-outfit font-black tracking-tight text-foreground">
          Comments <span className="gradient-text">Management</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
          Track and manage discussions across all your publications. 
          Keep your community healthy and engaged.
        </p>
      </div>

      {!userComments.length ? (
        <Card className="glass-card border-none bg-background/40 backdrop-blur-xl py-20 text-center rounded-[40px]">
          <CardContent className="space-y-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-primary opacity-40" />
            </div>
            <h3 className="text-2xl font-bold">No comments found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Your articles haven&apos;t received any comments yet. 
              Share your work to start a conversation!
            </p>
            <Button asChild className="rounded-2xl mt-4 bg-primary px-8">
              <Link href="/dashboard">Return to Overview</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {userComments.map((comment) => (
            <Card key={comment.id} className="glass-card border-none bg-background/40 backdrop-blur-xl rounded-[32px] overflow-hidden group hover:bg-primary/[0.02] transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <Avatar className="h-14 w-14 border-2 border-background shadow-lg shadow-primary/10">
                      <AvatarImage src={comment.author.imageUrl || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {comment.author.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                   </Avatar>

                   <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                            <h4 className="font-outfit font-extrabold text-xl text-foreground flex items-center gap-2">
                                {comment.author.name}
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest">Reader</span>
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(comment.createdAt).toLocaleDateString()}</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {comment.author.email}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <Link href={`/articles/${comment.articleId}`} target="_blank">
                                <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 glass border-border/50 hover:bg-primary/5">
                                    <ExternalLink className="h-4 w-4" />
                                    View Article
                                </Button>
                            </Link>
                            <DeleteCommentButton commentId={comment.id} />
                         </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-muted/40 border border-border/50 relative">
                         <p className="text-foreground font-medium leading-relaxed italic">
                            &quot;{comment.body}&quot;
                         </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                        On Article: <span className="text-primary hover:underline cursor-pointer">{comment.article?.title}</span>
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
