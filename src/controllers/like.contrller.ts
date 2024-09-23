import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { LikeService } from "../services/like.service";
import { onError } from "../utils/on-error.util";

export class LikeController {
  public static async create(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      if (!tweetId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId or user",
        });
      }

      const service = new LikeService();
      const result = await service.createLike({
        tweetId,
        user: user as Users,
      });

      return res.status(200).json({
        ok: true,
        message: result.message,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
