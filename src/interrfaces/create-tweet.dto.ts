import { TypeTweet } from "@prisma/client";
/**
 * @interface CreateTweetDTO representa o formato do objeto que carrega as informações necessárias para criar um novo tweet.
 */

export interface CreateTweetDTO {
  userId: string;
  content: string;
  type: TypeTweet;
}
