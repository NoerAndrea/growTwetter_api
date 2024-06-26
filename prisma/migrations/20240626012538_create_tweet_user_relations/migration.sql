/*
  Warnings:

  - Added the required column `user_id` to the `tweets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tweets" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
