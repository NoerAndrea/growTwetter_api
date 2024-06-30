import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { Users } from "@prisma/client";

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
          user: true,
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

  public static async update(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { content, user } = req.body;

      const tweetIsFromTheUser = await prismaConnection.tweet.findFirst({
        where: {
          id: tweetId,
          userId: user.id,
        },
        include: {
          user: true,
        },
      });

      if (!tweetIsFromTheUser) {
        return res.status(400).json({
          ok: false,
          message: "Invalid tweet.",
        });
      }
      const updateTweet = await prismaConnection.tweet.update({
        where: { id: tweetId },
        data: {
          content: content,
        },
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

      const tweetIsFromTheUser = await prismaConnection.tweet.findFirst({
        where: {
          id: tweetId,
          userId: user.id,
        },
        include: {
          user: true,
        },
      });
      if (!tweetIsFromTheUser) {
        return res.status(400).json({
          ok: false,
          message: "Invalid tweet.",
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
