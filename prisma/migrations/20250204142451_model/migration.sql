-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
