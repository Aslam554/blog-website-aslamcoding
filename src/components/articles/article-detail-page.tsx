import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import CommentForm from "../comments/comment-form";
import CommentList from "../comments/comment-list";
import { db } from "@/db";
import { comments as commentsTable, likes as likesTable, articles as articlesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import LikeButton from "./actions/like-button";
import { auth } from "@/auth";
import ArticleChat from "./article-chat";
import SocialShareBar from "./social-share-bar";
import Image from "next/image";
import { Button } from "../ui/button";
import ReadingProgress from "./reading-progress";
import BackToTop from "../back-to-top";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type ArticleDetailPageProps = {
  article: {
    id: string;
    title: string;
    content: string;
    category: string;
    featuredImage: string;
    createdAt: Date;
    author: {
      name: string | null;
      email: string;
      imageUrl: string | null;
    };
  };
};

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  // Run ALL queries in parallel instead of sequentially
  const [comments, artWithImages, likes, session] = await Promise.all([
    db.query.comments.findMany({
      where: eq(commentsTable.articleId, article.id),
      with: {
        author: true,
        likes: true,
      },
      orderBy: (comments, { desc }) => [desc(comments.createdAt)],
    }),
    db.query.articles.findFirst({
      where: eq(articlesTable.id, article.id),
      with: {
        images: true,
      },
    }),
    db.query.likes.findMany({
      where: eq(likesTable.articleId, article.id),
    }),
    auth(),
  ]);

  // Use session.user.id from JWT instead of extra DB query
  const userId = session?.user?.id ?? null;
  const isLiked = likes.some((like) => like.userId === userId);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-outfit selection:bg-primary/20">
      <ReadingProgress />
      <SocialShareBar title={article.title} url={typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/articles/${article.id}`} />
      <BackToTop />
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute top-[40%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-[-5%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <main className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Header Section */}
          <header className="mb-16 space-y-8">
            <div className="flex flex-wrap items-center gap-4">
               <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                  {article.category}
               </span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <span className="flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                   <span className="flex items-center gap-1.5">
                     <Clock className="h-4 w-4" />
                     {Math.max(1, Math.ceil(article.content.split(/\s+/).length / 225))} min read
                   </span>
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-outfit font-bold tracking-tight text-foreground leading-[1.1]">
              {article.title}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-border/50">
               <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                    <AvatarImage src={article.author.imageUrl as string} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{(article.author.name || "Anonymous").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-outfit font-semibold text-foreground text-lg leading-none mb-1">
                      {article.author.name ?? "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Principal Content Creator
                    </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full glass border-border/50 hover:bg-muted/50">
                     <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full glass border-border/50 hover:bg-muted/50">
                     <Bookmark className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[32px] shadow-2xl">
               <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </header>

          {/* Content Section */}
          <section className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-outfit prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-3xl prose-a:text-primary prose-code:text-primary prose-pre:bg-muted/50 prose-pre:rounded-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {article.content}
            </ReactMarkdown>
          </section>

          {/* Article Gallery (LinkedIn-style) */}
          {artWithImages?.images && artWithImages.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 animate-in fade-in zoom-in-95 duration-700">
               {artWithImages.images.map((img, index) => (
                  <div key={img.id} className={cn(
                    "relative aspect-video rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-zoom-in",
                    index === 0 && artWithImages.images.length % 2 !== 0 && "md:col-span-2 aspect-[21/9]"
                  )}>
                     <Image 
                        src={img.imageUrl} 
                        alt={`${article.title} - Gallery Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 448px"
                        className="object-cover"
                     />
                     <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
               ))}
            </div>
          )}

          {/* Interaction Section */}
          <div className="flex items-center gap-6 mb-16 py-8 border-y border-border/50">
             <LikeButton articleId={article.id} likes={likes} isLiked={isLiked} />
             <div className="flex items-center gap-2 text-muted-foreground group cursor-pointer hover:text-foreground transition-colors">
                <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="font-bold text-foreground">{comments.length} Comments</span>
             </div>
          </div>

          <Card className="glass-card p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <MessageCircle className="h-24 w-24" />
            </div>
            
            <div className="relative z-10">
               <h2 className="text-3xl font-outfit font-bold text-foreground mb-8">
                Join the Discussion
               </h2>

               <CommentForm 
                 articleId={article.id} 
                 userImage={session?.user?.image || null} 
               />
               
               <div className="mt-16">
                  <CommentList 
                    comments={comments} 
                    articleId={article.id} 
                    currentUserId={userId || undefined}
                  />
               </div>
            </div>
          </Card>
        </article>
      </main>
      <ArticleChat 
        articleTitle={article.title} 
        articleContent={article.content} 
      />
    </div>
  );
}
