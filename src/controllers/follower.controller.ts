import { Request, Response } from "express";

import { Users } from "@prisma/client";
import { FollowerService } from "../services/follower.service";
import { onError } from "../utils/on-error.util";

export class FollowerController {
  public static async toggle(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { user } = req.body;

      if (!userId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: userId or user",
        });
      }

      const service = new FollowerService();
      const result = await service.toggle({
        user: user as Users,
        userId,
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
