import { BlogFooter } from "@/components/home/blog-footer";
import HeroSection from "@/components/home/hero-section";
import { TopArticles } from "@/components/home/top-articles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getVideos } from "@/actions/getVideos";
import { getPlaylists } from "@/actions/getPlaylists";
import dynamic from "next/dynamic";

// Lazy-load heavy client components to reduce initial JS bundle
const CategoryShowcase = dynamic(() => import("@/components/home/category-showcase"), {
  loading: () => <div className="py-24" />,
});
const YouTubeSlider = dynamic(() => import("@/components/home/youtube-slider"), {
  loading: () => <div className="py-24 bg-black/5" />,
});
const PopularCourses = dynamic(() => import("@/components/home/popular-courses"), {
  loading: () => <div className="py-24" />,
});
const SocialPromo = dynamic(() => import("@/components/home/social-promo"), {
  loading: () => <div className="py-16" />,
});
const NewsletterForm = dynamic(() => import("@/components/home/newsletter-form"), {
  loading: () => <div className="py-16" />,
});

export default async function Page() {
  const [videos, playlists] = await Promise.all([
    getVideos("date"),
    getPlaylists()
  ]);

  return (
    <main className="relative overflow-hidden bg-background">
      {/* Global Background Blobs */}
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <HeroSection />
      <CategoryShowcase />
      
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-foreground sm:text-5xl">
              Featured <span className="gradient-text">Insights</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Deep dives into technology, design, and the future of digital innovation.
            </p>
          </div>

          {/* Top Articles */}
          <Suspense fallback={
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          }>
            <TopArticles/>
          </Suspense>

          <div className="mt-16 text-center">
            <Link href={"/articles"}>
              <Button
                variant="outline"
                className="group rounded-full px-10 h-14 text-lg glass border-border/50 hover:bg-muted/50 transition-all font-semibold"
              >
                Explore All Articles
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <YouTubeSlider videos={videos} />
      <PopularCourses playlists={playlists} />
      <SocialPromo />
      <NewsletterForm />
      <BlogFooter />
    </main>
  );
}
