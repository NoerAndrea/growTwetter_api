import { Users } from "@prisma/client";

export interface LikeDTO {
  tweetId: string;
  user: Users;
}
