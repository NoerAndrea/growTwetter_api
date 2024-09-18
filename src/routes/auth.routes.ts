import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { LoginMiddleware } from "../middlewares/auth/login.middleware";

export class AuthRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/signin", [LoginMiddleware.validate], AuthController.login);

    return router;
  }
}
