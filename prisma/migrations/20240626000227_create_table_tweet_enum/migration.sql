-- CreateEnum
CREATE TYPE "TypeTweet" AS ENUM ('TWEET', 'REPLY');

-- CreateTable
CREATE TABLE "tweets" (
    "id" UUID NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "type" "TypeTweet" NOT NULL DEFAULT 'TWEET',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id")
);
