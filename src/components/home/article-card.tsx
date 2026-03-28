"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    content: string | null;
    category: string;
    featuredImage: string | null;
    createdAt: Date;
    author: {
      name: string | null;
      imageUrl: string | null;
    };
  };
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/articles/${article.id}`} className="group block h-full">
        <Card className="glass-card h-full overflow-hidden border-none p-0">
          {/* Image Container */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={article.featuredImage as string}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                {article.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col p-6">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarImage src={article.author.imageUrl as string} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {(article.author.name || "A").charAt(0)}
                </AvatarFallback>
              </Avatar>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                  {article.author.name ?? "Anonymous"}
                </span>
            </div>

            {/* Article Title */}
            <h3 className="mb-3 text-xl font-outfit font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            
            <p className="mb-6 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
               Discover insights and trends in {article.category.toLowerCase()} through this expert analysis.
            </p>

            {/* Article Meta Info */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.max(1, Math.ceil((article.content || "").split(/\s+/).length / 225))} min read
                </span>
              </div>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 text-primary opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
