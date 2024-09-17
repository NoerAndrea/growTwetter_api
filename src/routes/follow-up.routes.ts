import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ToggleFollowUpMiddleware } from "../middlewares/followers/follow-up.middleware";
import { FollowerController } from "../controllers/follower.controller";

export class FollowUpRoutes {
  public static execute(): Router {
    const router = Router();
    router.post(
      "/",
      [AuthMiddleware.validate, ToggleFollowUpMiddleware.validate],
      FollowerController.toggle
    );
    return router;
  }
}
