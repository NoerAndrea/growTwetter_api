/*
  Warnings:

  - You are about to drop the column `auth_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "auth_token";
