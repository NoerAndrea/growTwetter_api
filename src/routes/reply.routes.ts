import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { CreateReplyMiddleware } from "../middlewares/reply/create-reply";
import { ReplyController } from "../controllers/reply.controller";

export class ReplyRoutes {
  public static execute(): Router {
    const router = Router();

    router.post(
      "/",
      [AuthMiddleware.validate, CreateReplyMiddleware.validate],
      ReplyController.create
    );
    return router;
  }
}
