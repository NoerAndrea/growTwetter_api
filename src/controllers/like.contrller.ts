import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { Users } from "@prisma/client";

export class LikeController {
  public static async create(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      const likeMyTweet = await prismaConnection.tweet.findMany({
        where: { id: tweetId, userId: (user as Users).id },
        include: {
          user: true,
        },
      });
      if (likeMyTweet.length > 0) {
        return res.status(400).json({
          ok: false,
          message: "Unable to like your own tweet.",
        });
      }

      const tweetFound = await prismaConnection.tweet.findFirst({
        where: { id: tweetId },
      });

      if (!tweetFound) {
        return res.status(400).json({
          ok: false,
          message: "Tweet not found.",
        });
      }

      const likedUser = await prismaConnection.like.count({
        where: {
          tweetId: tweetId,
          userId: (user as Users).id,
        },
      });

      const countLike = await prismaConnection.like.count({
        where: { tweetId: tweetId },
      });

      if (likedUser) {
        const likedTweet = await prismaConnection.like.deleteMany({
          where: {
            tweetId: tweetId,
            userId: (user as Users).id,
          },
        });

        return res.status(200).json({
          ok: true,
          message: "Like removed successfully.",
          likedTweet,
          totalLikes: countLike - 1,
        });
      } else {
        const createLike = await prismaConnection.like.create({
          data: {
            tweetId: tweetId,
            userId: (user as Users).id,
          },
        });

        return res.status(200).json({
          ok: true,
          message: "Tweet successfully liked.",
          createLike,
          totalLikes: countLike + 1,
        });
      }
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }
}
