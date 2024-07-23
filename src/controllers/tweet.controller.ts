import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";

export class TweetController {
  public static async create(req: Request, res: Response) {
    try {
      const { user, content } = req.body;

      const createTweet = await prismaConnection.tweet.create({
        data: {
          userId: (user as Users).id,
          content: content,
        },
      });

      return res.status(201).json({
        ok: true,
        message: `Tweet successfully created for the user ${
          (user as Users).username
        }`,
        createTweet,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error",
      });
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const tweets = await prismaConnection.tweet.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: user.id,
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
      return res.status(200).json({
        ok: true,
        user: user,
        tweets: tweets,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
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

      const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
        where: {
          id: tweetId,
          userId: user.id,
        },
      });

      if (!tweetIsFromTheUser) {
        return res.status(404).json({
          ok: false,
          message: "Tweet not found.",
        });
      }

      const updateTweet = await prismaConnection.tweet.update({
        where: { id: tweetIsFromTheUser.id },
        data: { content },
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet updated successfully.",
        updateTweet,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
        where: {
          id: tweetId,
          userId: user.id,
        },
      });

      if (!tweetIsFromTheUser) {
        return res.status(404).json({
          ok: false,
          message: "Tweet not found.",
        });
      }

      const deleteTweet = await prismaConnection.tweet.delete({
        where: {
          id: tweetId,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet deleted successfully.",
        deleteTweet,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }
}
