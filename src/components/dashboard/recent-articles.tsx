"use client";
import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { deleteArticle } from "@/actions/delete-article";
import { Edit3, Trash2, ExternalLink, MessageCircle } from "lucide-react";

type RecentArticlesProps = {
  articles: {
    id: string;
    title: string;
    createdAt: Date;
    comments: any[];
    author: {
      name: string;
      email: string;
      imageUrl: string | null;
    };
  }[];
};

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
  return (
    <Card className="glass-card border-none overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-outfit font-bold">Recent Publications</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/10 rounded-full">
            View All Content
          </Button>
        </div>
      </CardHeader>
      {!articles.length ? (
        <CardContent className="py-20 text-center text-muted-foreground font-medium">
          No articles found. Start by creating your first masterpiece.
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-4 font-bold text-foreground/70 uppercase text-xs tracking-widest pl-8">Article Title</TableHead>
                <TableHead className="py-4 font-bold text-foreground/70 uppercase text-xs tracking-widest text-center">Status</TableHead>
                <TableHead className="py-4 font-bold text-foreground/70 uppercase text-xs tracking-widest text-center">Interactions</TableHead>
                <TableHead className="py-4 font-bold text-foreground/70 uppercase text-xs tracking-widest">Published On</TableHead>
                <TableHead className="py-4 font-bold text-foreground/70 uppercase text-xs tracking-widest text-right pr-8">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.slice(0, 5).map((article) => (
                <TableRow key={article.id} className="group border-b border-border/50 hover:bg-primary/[0.02] transition-colors">
                  <TableCell className="py-5 font-outfit font-semibold text-foreground pl-8">
                     <Link href={`/articles/${article.id}`} className="hover:text-primary transition-colors flex items-center gap-2">
                        {article.title}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Live
                    </span> 
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="inline-flex items-center gap-1.5 text-muted-foreground font-medium px-3 py-1 rounded-lg bg-muted/50">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {article.comments.length}
                     </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                     {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                           <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteButton articleId={article.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default RecentArticles;

type DeleteButtonProps = {
  articleId: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ articleId }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() =>
        startTransition(async () => {
          await deleteArticle(articleId);
        })
      }
    >
      <Button 
         disabled={isPending} 
         variant="ghost" 
         size="icon" 
         type="submit"
         className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        {isPending ? <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </form>
  );
};
