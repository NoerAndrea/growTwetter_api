import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { TweetController } from "../controllers/tweet.controller";

export class FeedRoutes {
  public static execute(): Router {
    const router = Router();

    router.get("/tweetsAll", TweetController.listAll);

    return router;
  }
}
