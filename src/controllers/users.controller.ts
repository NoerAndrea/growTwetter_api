import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";

export class UsersController {
  public static async create(req: Request, res: Response) {
    try {
      const { name, email, username, password } = req.body;

      const newUser = await prismaConnection.users.create({
        data: {
          name,
          email,
          username,
          password,
        },
      });
      console.log(newUser);

      return res.status(201).json({
        ok: true,
        message: "Student successfully registered.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "An unexpected error occurred.",
      });
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      const users = await prismaConnection.users.findMany({
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
      return res.status(500).json({
        ok: false,
        message: "An unexpected error occurred.",
      });
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
      return res.status(500).json({
        ok: false,
        message: "An unexpected error occurred.",
      });
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
      return res.status(500).json({
        ok: false,
        message: "An unexpected error occurred.",
      });
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
      return res.status(500).json({
        ok: false,
        message: "An unexpected error occurred.",
      });
    }
  }
}
