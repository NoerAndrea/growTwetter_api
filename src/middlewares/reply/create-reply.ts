import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";

export class CreateReplyMiddleware {
  public static validate(req: Request, res: Response, next: NextFunction) {
    const { content, tweetOriginalId } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Provide content for the Tweet.",
      });
    }

    if (!tweetOriginalId || !validate(tweetOriginalId)) {
      return res.status(400).json({
        ok: false,
        message: "Provide content for the Tweet Original Id valid.",
      });
    }

    return next();
  }
}
