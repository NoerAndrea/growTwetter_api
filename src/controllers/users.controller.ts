import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { UserService } from "../services/user.service";
import { onError } from "../utils/on-error.util";

export class UsersController {
  public static async create(req: Request, res: Response) {
    try {
      const { name, email, username, password } = req.body;

      /*const existingUser = await prismaConnection.users.findFirst({
        where: { 
          OR: [{ email }, { username }]
        },
      });*/

      /*if (existingUser) {
        return res.status(400).json({
          ok: false,
          message: "Email or username already in use.",
        });
      }*/

      /*await prismaConnection.users.create({
        data: {
          name,
          email,
          username,
          password,
        },
      });*/

      const service = new UserService();
      const data = await service.createUser({
        name,
        email,
        username,
        password,
      });

      return res.status(201).json({
        ok: true,
        message: "Student successfully registered.",
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      const users = await prismaConnection.users.findMany({
        where: { deleted: false },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          deleted: true,
          deletedAt: true,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "Successfully listed user.",
        users: users,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async get(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userFound = await prismaConnection.users.findUnique({
        where: {
          id: userId,
          deleted: false,
        },
      });

      if (!userFound) {
        return res.status(404).json({
          ok: false,
          message: "The user does not exist in the database.",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "User found.",
        student: userFound,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, username } = req.body;

      const userUpdated = await prismaConnection.users.update({
        where: {
          id: userId,
          deleted: false,
        },
        data: {
          name: name,
          username: username,
        },
      });
      return res.status(200).json({
        ok: true,
        message: "Successfully update user.",
        userUpdated,
      });
    } catch (err) {
      return onError(err, res);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userDeleted = await prismaConnection.users.update({
        where: { id: userId, deleted: false },
        data: { deleted: true, deletedAt: new Date() },
      });

      return res.status(200).json({
        ok: true,
        message: "Successfully delete user.",
        userDeleted,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
