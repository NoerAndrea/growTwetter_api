import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../../database/prismaConnection";

export class CreateUserMiddleware {
  public static async validade(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, email, username, password } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Name is mandatory.",
      });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        ok: false,
        message: "Provide valid email.",
      });
    }

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Username is mandatory.",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "Enter a password with at least 6 characters.",
      });
    }

    try {
      const existingUser = await prismaConnection.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          ok: false,
          message: "Email already in use.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }

    next();
  }
}
