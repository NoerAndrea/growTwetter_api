import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { TweetController } from "../controllers/tweet.controller";
import { tweetMiddleware } from "../middlewares/tweet/tweet.middleware";

export class TweetRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate],
      [tweetMiddleware.validade],
      TweetController.create
    );
    router.get("/", [AuthMiddleware.validate], TweetController.list);
    router.put("/:tweetId", [AuthMiddleware.validate], TweetController.update);
    router.delete(
      "/:tweetId",
      [AuthMiddleware.validate],
      TweetController.delete
    );

    return router;
  }
}
