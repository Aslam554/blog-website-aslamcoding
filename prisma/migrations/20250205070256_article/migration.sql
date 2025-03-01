-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
