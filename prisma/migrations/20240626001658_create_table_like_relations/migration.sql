-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tweet_id" UUID NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_key" ON "Like"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_tweet_id_key" ON "Like"("tweet_id");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
