import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { CreateUserMiddleware } from "../middlewares/users/create-user.middleware";

export class UserRoutes {
  public static execute(): Router {
    const router = Router();

    router.post("/", [CreateUserMiddleware.validade], UsersController.create);
    router.get("/", UsersController.list);
    router.put("/:userId", UsersController.update);
    router.patch("/:userId", UsersController.delete);

    return router;
  }
}
