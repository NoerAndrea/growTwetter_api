import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { TweetService } from "../services/tweet.service";
import { onError } from "../utils/on-error.util";

export class TweetController {
  public static async create(req: Request, res: Response) {
    try {
      const { user, content, type } = req.body;

      if (!user || !content || !type) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: user, content, or type",
        });
      }

      const service = new TweetService();
      const createTweet = await service.createTweet({
        content,
        type,
        userId: (user as Users).id,
      });

      return res.status(201).json({
        ok: true,
        message: `Tweet successfully created for the user ${
          (user as Users).username
        }`,
        tweet: createTweet,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      const { user } = req.body;

      if (!user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "User not provided or invalid.",
        });
      }

      const service = new TweetService();
      const tweets = await service.listTweet((user as Users).id);

      return res.status(200).json({
        ok: true,
        user: user,
        tweets: tweets,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async listAll(req: Request, res: Response) {
    try {
      const tweets = await prismaConnection.tweet.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
              name: true,
            },
          },
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

      return res.status(200).json({
        ok: true,
        data: tweets,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { content, user } = req.body;

      if (!tweetId || !content || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId, content, or user",
        });
      }

      const service = new TweetService();
      const updateTweet = await service.updateTweet({
        tweetId,
        content,
        userId: (user as Users).id,
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet updated successfully.",
        tweet: updateTweet,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      if (!tweetId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId or user",
        });
      }

      const service = new TweetService();
      const tweetDeleted = await service.deleteTweet({
        tweetId,
        userId: (user as Users).id,
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet deleted successfully.",
        tweet: tweetDeleted,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
