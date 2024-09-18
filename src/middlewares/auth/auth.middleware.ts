import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../../database/prismaConnection";
import { JWT } from "../../libs/jwt.lib";

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(401).json({
        ok: false,
        message: "Token is mandatory.",
      });
    }

    const jwtToken = bearerToken.replace(/Bearer/i, "").trim();

    const jwt = new JWT();
    const userLogged = jwt.decodedToken(jwtToken);

    if (!userLogged) {
      return res.status(401).json({
        ok: false,
        message: "Token invalid",
      });
    }

    req.body.user = userLogged;
    return next();
  }
}
