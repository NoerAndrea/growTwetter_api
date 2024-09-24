import { TypeTweet } from "@prisma/client";
import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { CreateReplyDTO } from "../interrfaces/create-reply.dto";

export class ReplyService {
  public async createReply(
    input: CreateReplyDTO
  ): Promise<{ message: string }> {
    const { user, content, tweetOriginalId } = input;

    const tweetFound = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetOriginalId,
        type: TypeTweet.TWEET,
      },
    });

    if (!tweetFound) {
      throw new HttpError("Original Tweet not found", 404);
    }

    const tweetReplyCreated = await prismaConnection.tweet.create({
      data: {
        userId: user.id,
        content: content,
        type: TypeTweet.REPLY,
      },
    });

    await prismaConnection.reply.create({
      data: {
        idTweetOne: tweetOriginalId,
        idTweetReply: tweetReplyCreated.id,
      },
    });
    return {
      message: "Reply successfully created.",
    };
  }
}
