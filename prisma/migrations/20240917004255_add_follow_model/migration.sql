-- CreateTable
CREATE TABLE "followers" (
    "id" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_follower" UUID NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_id_follower_fkey" FOREIGN KEY ("id_follower") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
