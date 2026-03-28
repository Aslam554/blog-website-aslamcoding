"use client";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Tag, Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type SearchPageProps = {
  articles: {
    id: string;
    title: string;
    category: string;
    featuredImage: string;
    createdAt: Date;
    author: {
      name: string;
      email: string;
      imageUrl: string | null;
    };
  }[];
};

const CATEGORIES = [
  { id: "all", label: "All Insights" },
  { id: "leetcode", label: "Leetcode Problems" },
  { id: "codeforces", label: "Codeforces Problems" },
  { id: "cs-fundamentals", label: "CS Fundamentals" },
  { id: "system-design", label: "System Design" },
  { id: "programming", label: "Programming" },
  { id: "technology", label: "Technology" },
];

export function AllArticlesPage({ articles }: SearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") return articles;
    return articles.filter(article => article.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [articles, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                : "bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <NoSearchResults />
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredArticles.map((article) => (
              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/articles/${article.id}`} className="group block h-full">
                  <Card className="glass-card border-none overflow-hidden h-full flex flex-col hover:translate-y-[-8px] transition-all duration-500 bg-background/40 backdrop-blur-xl group-hover:shadow-2xl group-hover:shadow-primary/10">
                    <div className="p-5 flex flex-col h-full gap-5">
                      {/* Image Container */}
                      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={article.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                                {article.category}
                            </span>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-outfit font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        {/* Summary simulation */}
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-80">
                          {article.title} - Explore the latest insights in {article.category} and master the art of competitive programming and software engineering.
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-5 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50 shadow-inner">
                            <AvatarImage src={article.author.imageUrl as string} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{article.author.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-foreground">
                                {article.author.name}
                             </span>
                             <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5" />
                                {new Date(article.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                           <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/5 rounded-[40px] border border-dashed border-border/50">
      <div className="mb-6 rounded-3xl bg-primary/5 p-6 shadow-inner">
        <Search className="h-12 w-12 text-primary/40" />
      </div>
      <h3 className="text-2xl font-outfit font-bold text-foreground">
        No articles found in this category
      </h3>
      <p className="mt-3 text-muted-foreground font-medium max-w-sm">
        We couldn't find any articles matching this category. Check back later or explore other insights!
      </p>
    </div>
  );
}
