-- CreateTable
CREATE TABLE "replies" (
    "id" UUID NOT NULL,
    "id_tweet_one" UUID NOT NULL,
    "id_tweet_reply" UUID NOT NULL,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "replies_id_tweet_reply_key" ON "replies"("id_tweet_reply");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_id_tweet_one_fkey" FOREIGN KEY ("id_tweet_one") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_id_tweet_reply_fkey" FOREIGN KEY ("id_tweet_reply") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
