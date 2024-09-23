import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { LikeDTO } from "../interrfaces/create-like.dto";

export class LikeService {
  public async createLike(input: LikeDTO): Promise<{ message: string }> {
    const { tweetId, user } = input;

    const tweetFound = await prismaConnection.tweet.findFirst({
      where: { id: tweetId },
    });

    if (!tweetFound) {
      throw new HttpError("Tweet not found", 404);
    }

    const likeExists = await prismaConnection.like.findFirst({
      where: {
        tweetId: tweetId,
        userId: user.id,
      },
    });

    if (likeExists) {
      await prismaConnection.like.delete({
        where: { id: likeExists.id },
      });

      return {
        message: "Like removed successfully.",
      };
    }

    await prismaConnection.like.create({
      data: {
        tweetId: tweetId,
        userId: user.id,
      },
    });

    return {
      message: "Tweet successfully liked.",
    };
  }
}
