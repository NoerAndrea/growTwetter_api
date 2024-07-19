import { NextFunction, Request, Response } from "express";

export class tweetMiddleware {
  public static validade(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Provide content for the Tweet.",
      });
    }

    return next();
  }
}
