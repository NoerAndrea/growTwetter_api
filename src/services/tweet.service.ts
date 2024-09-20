import { prismaConnection } from "../database/prismaConnection";
import { CreateTweetDTO } from "../interrfaces/create-tweet.dto";
import { Tweet } from "@prisma/client";
import { HttpError } from "../errors/http.error";
import { DeleteTweetDTO } from "../interrfaces/delete-tweet.dto";

export class TweetService {
  public async createTweet(input: CreateTweetDTO): Promise<Tweet> {
    const { userId, content, type } = input;

    const userExists = await this.isUsernamerAlreadyExists(input.userId);

    if (userExists) {
      throw new HttpError("User already exists.", 409);
    }

    const createTweet = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: input.type,
      },
    });

    return createTweet;
  }

  public async listTweet(userId: string): Promise<Tweet[]> {
    const tweets = await prismaConnection.tweet.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: userId,
      },
      include: {
        likes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return tweets;
  }

  public async updateTweet(input: UpdateTweetDTO): Promise<Tweet> {
    const { tweetId, userId, content } = input;

    const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetId,
        userId: userId,
      },
    });

    if (!tweetIsFromTheUser) {
      throw new HttpError(
        "Tweet not found or does not belong to the user.",
        404
      );
    }

    const updateTweet = await prismaConnection.tweet.update({
      where: { id: tweetIsFromTheUser.id },
      data: { content: content },
    });
    return updateTweet;
  }

  public async deleteTweet(input: DeleteTweetDTO): Promise<Tweet> {
    const { tweetId, userId } = input;

    const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetId,
        userId: userId,
      },
    });

    if (!tweetIsFromTheUser) {
      throw new HttpError(
        "Tweet not found or does not belong to the user.",
        404
      );
    }

    const deleteTweet = await prismaConnection.tweet.delete({
      where: {
        id: tweetId,
      },
    });
    return deleteTweet;
  }

  public async isUsernamerAlreadyExists(userId: string): Promise<boolean> {
    const existingUsername = await prismaConnection.users.findFirst({
      where: {
        id: userId,
        deleted: false,
      },
    });
    return Boolean(existingUsername);
  }
}
