/*
  Warnings:

  - You are about to drop the column `deleted` on the `tweets` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `tweets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tweet_id,user_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_tweet_id_key";

-- DropIndex
DROP INDEX "Like_user_id_key";

-- AlterTable
ALTER TABLE "tweets" DROP COLUMN "deleted",
DROP COLUMN "deleted_at";

-- CreateIndex
CREATE UNIQUE INDEX "Like_tweet_id_user_id_key" ON "Like"("tweet_id", "user_id");
