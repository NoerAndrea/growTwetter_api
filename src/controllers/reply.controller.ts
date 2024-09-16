import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { TypeTweet, Users } from "@prisma/client";

export class ReplyController {
  public static async create(req: Request, res: Response) {
    try {
      const { user, content, tweetOriginalId } = req.body;

      const tweetFound = await prismaConnection.tweet.findUnique({
        where: {
          id: tweetOriginalId,
          type: TypeTweet.TWEET,
        },
      });

      if (!tweetFound) {
        return res.status(404).json({
          ok: false,
          message: "Original Tweet not found",
        });
      }

      const tweetReplyCreated = await prismaConnection.tweet.create({
        data: {
          userId: (user as Users).id,
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

      return res.status(201).json({
        ok: true,
        message: `Reply successfully created for the user ${
          (user as Users).username
        }`,
        tweet: tweetReplyCreated,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error",
      });
    }
  }
}
