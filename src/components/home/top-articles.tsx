import { db } from "@/db";
import { desc } from "drizzle-orm";
import { articles as articlesTable } from "@/db/schema";
import { ArticleCard } from "./article-card";
import { unstable_cache } from "next/cache";

const getCachedTopArticles = unstable_cache(
  async () => {
    return db.query.articles.findMany({
      orderBy: [desc(articlesTable.createdAt)],
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
      limit: 3,
    });
  },
  ["top-articles"],
  { revalidate: 60 } // Cache for 60 seconds
);

export async function TopArticles() {
  const articles = await getCachedTopArticles();

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          index={index} 
        />
      ))}
    </div>
  );
}
