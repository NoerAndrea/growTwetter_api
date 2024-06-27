import { NextFunction, Request, Response } from "express";

export class LoginMiddleware {
    public static validate(req: Request, res: Response, next: NextFunction){
        const {email, password} = req.body;

        if (!email || typeof email !== 'string' || !email.includes("@")) {
            return res.status(400).json({
                ok: false,
                message: "Please provide a valid email."
            });
        }

        if(!password || typeof password !== 'string') {
            return res.status(400).json({
                ok: false,
                message: "Enter a password in character set format."
            });
        }

        return next();
    }
}