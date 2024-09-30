import { Tweet } from "@prisma/client"; // Ajuste conforme necessário
import { randomUUID } from "crypto";

export class TweetMock {
  public static buildFakeTweet(): Tweet {
    return {
      id: randomUUID(),
      content: "This is a mock tweet.",
      type: "TWEET",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: randomUUID(),
    };
  }
}
