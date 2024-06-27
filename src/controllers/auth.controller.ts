import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userFound = await prismaConnection.users.findUnique({
        where: {
          email: email,
          password: password,
        },
      });

      if (!userFound) {
        return res.status(401).json({
          ok: false,
          message: "Invalid credentials.",
        });
      }

      if (userFound.authToken) {
        return res.status(400).json({
          ok: false,
          message: "User already authenticated",
        });
      }

      const authToken = randomUUID();

      await prismaConnection.users.update({
        where: { id: userFound.id },
        data: { authToken },
      });
      return res.status(200).json({
        ok: true,
        message: "Aluno autenticado",
        authToken,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An unexpected error has occurred.",
      });
    }
  }

  public static async logout(req: Request, res: Response) {
    try {
      const headers = req.headers;

      if (!headers.authorization) {
        return res.status(401).json({
          ok: false,
          message: "Invalid credentials.",
        });
      }

      await prismaConnection.users.updateMany({
        where: {
          authToken: headers.authorization,
        },
        data: { authToken: null },
      });
      return res.status(200).json({
        ok: true,
        message: "Logout completed successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An unexpected error has occurred.",
      });
    }
  }
}
