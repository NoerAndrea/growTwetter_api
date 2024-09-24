import { Users } from "@prisma/client";

export interface CreateReplyDTO {
  user: Users;
  content: string;
  tweetOriginalId: string;
}
