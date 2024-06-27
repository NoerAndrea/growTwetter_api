import { NextFunction, Request, Response } from "express";
import { prismaConnection } from "../../database/prismaConnection";

export class AuthMiddleware {
    public static async validate(req: Request, res: Response, next: NextFunction){
        const headers = req.headers;

        if(!headers.authorization){
            return res.status(401).json({
                ok: false,
                message: "Token is mandatory."
            });
        }
        const userFound = await prismaConnection.users.findFirst({
            where: { authToken: headers.authorization}
        });

        if(!userFound){
            return res.status(401).json({
                ok: false,
                message: "Unauthorized user."
            });
        }
        req.body.user = userFound;
        return next();
    }
}