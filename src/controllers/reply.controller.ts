import { Request, Response } from "express";
import { ReplyService } from "../services/reply.service";
import { Users } from "@prisma/client";
import { onError } from "../utils/on-error.util";

export class ReplyController {
  public static async create(req: Request, res: Response) {
    try {
      const { content, tweetOriginalId } = req.body;
      const { user } = req.body;

      if (!content || !tweetOriginalId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: content, tweetOriginalId, or user",
        });
      }

      const service = new ReplyService();
      const result = await service.createReply({
        user: user as Users,
        content,
        tweetOriginalId,
      });

      return res.status(201).json({
        ok: true,
        message: result.message,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
