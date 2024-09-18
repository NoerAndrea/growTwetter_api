import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { AuthService } from "../services/auth.service";
import { onError } from "../utils/on-error.util";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const service = new AuthService();
      const { authToken } = await service.loginUser({
        email,
        password,
      });

      return res.status(200).json({
        ok: true,
        message: "Aluno autenticado",
        authToken,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
