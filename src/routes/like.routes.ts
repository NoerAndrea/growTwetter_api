import { Router } from "express";
import { LikeController } from "../controllers/like.contrller";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";

export class LikeRoutes {
  public static execute() {
    const router = Router();

    router.post("/:tweetId", [AuthMiddleware.validate], LikeController.create);

    return router;
  }
}
