import { TypeTweet } from "@prisma/client";
export interface CreateTweetDTO {
  userId: string;
  content: string;
  type: TypeTweet;
}
