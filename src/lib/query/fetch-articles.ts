import { db } from "@/db";
import { articles } from "@/db/schema";
import { count, ilike, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const fetchArticleByQuery = async (
  searchText: string,
  skip: number,
  take: number
) => {
  const getCachedArticles = unstable_cache(
    async () => {
      const [articlesData, totalResult] = await Promise.all([
        db.query.articles.findMany({
          where: or(
            ilike(articles.title, `%${searchText}%`),
            ilike(articles.category, `%${searchText}%`)
          ),
          with: {
            author: {
              columns: {
                name: true,
                imageUrl: true,
                email: true,
              },
            },
          },
          offset: skip,
          limit: take,
        }),
        db
          .select({ count: count() })
          .from(articles)
          .where(
            or(
              ilike(articles.title, `%${searchText}%`),
              ilike(articles.category, `%${searchText}%`)
            )
          ),
      ]);

      return { articles: articlesData, total: totalResult[0].count };
    },
    ["articles", searchText, String(skip), String(take)],
    { revalidate: 60 }
  );

  return getCachedArticles();
};