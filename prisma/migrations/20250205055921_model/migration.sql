-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
