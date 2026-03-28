import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { unstable_cache } from "next/cache";

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const getCachedArticle = unstable_cache(
  async (id: string) => {
    return db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: {
        author: {
          columns: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });
  },
  ["article-detail"],
  { revalidate: 60 }
);

const page: React.FC<ArticleDetailPageProps> = async ({ params }) => {
  const id = (await params).id;

  const article = await getCachedArticle(id);

  if (!article) {
    return <h1>Article not found.</h1>;
  }

  return (
    <div>
      <ArticleDetailPage article={article as any} />
    </div>
  );
};

export default page;
