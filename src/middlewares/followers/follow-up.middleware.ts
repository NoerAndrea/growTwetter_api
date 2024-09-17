import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";

export class ToggleFollowUpMiddleware {
  public static validate(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;

    if (!userId || !validate(userId)) {
      return res.status(400).json({
        ok: false,
        message: "Provide the user ID valid.",
      });
    }
    return next();
  }
}
