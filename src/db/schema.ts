import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  imageUrl: text("imageUrl"), // Keeping for compatibility with existing code
  image: text("image"), // NextAuth standard
  role: text("role").default("user"),
  bio: text("bio"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const articles = pgTable("articles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  featuredImage: text("featuredImage").notNull(),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = pgTable("comment", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  body: text("body").notNull(),
  articleId: text("articleId")
    .notNull()
    .references(() => articles.id),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id),
  parentId: text("parentId"), // For nested comments
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const commentLikes = pgTable(
  "commentLike",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    commentId: text("commentId")
      .notNull()
      .references(() => comments.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userCommentIndex: uniqueIndex("user_comment_idx").on(
      table.userId,
      table.commentId
    ),
  })
);

export const articleImages = pgTable("articleImage", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  articleId: text("articleId")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const likes = pgTable(
  "like",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    isLiked: boolean("isLiked").default(false).notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    articleId: text("articleId")
      .notNull()
      .references(() => articles.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userArticleIndex: uniqueIndex("user_article_idx").on(
      table.userId,
      table.articleId
    ),
  })
);

export const newsletters = pgTable("newsletter", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  articles: many(articles),
  comments: many(comments),
  likes: many(likes),
  commentLikes: many(commentLikes),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  images: many(articleImages),
}));

export const articleImagesRelations = relations(articleImages, ({ one }) => ({
  article: one(articles, {
    fields: [articleImages.articleId],
    references: [articles.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, {
    relationName: "replies",
  }),
  likes: many(commentLikes),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [likes.articleId],
    references: [articles.id],
  }),
}));

export const trackers = pgTable("tracker", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trackerLogs = pgTable("trackerLog", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackerId: text("trackerId")
    .notNull()
    .references(() => trackers.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  leetcodeCount: integer("leetcodeCount").default(0).notNull(),
  codeforcesCount: integer("codeforcesCount").default(0).notNull(),
  devProgress: text("devProgress"), // Description of development work
  description: text("description"), // General notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trackersRelations = relations(trackers, ({ one, many }) => ({
  user: one(users, {
    fields: [trackers.userId],
    references: [users.id],
  }),
  logs: many(trackerLogs),
}));

export const trackerLogsRelations = relations(trackerLogs, ({ one }) => ({
  tracker: one(trackers, {
    fields: [trackerLogs.trackerId],
    references: [trackers.id],
  }),
}));
