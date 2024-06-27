import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { CreateUserMiddleware } from "../middlewares/users/create-user.middleware";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/", [CreateUserMiddleware.validade], UsersController.create);
    router.get("/", UsersController.list);
    router.get("/:userId", UsersController.get);
    router.put("/", UsersController.update);
    router.post("/", UsersController.delete);

    return router;
  }
}
