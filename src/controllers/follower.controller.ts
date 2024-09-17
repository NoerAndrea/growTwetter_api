import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";

export class FollowerController {
  public static async toggle(req: Request, res: Response) {
    try {
      const { user, userId } = req.body;

      if (user.id === userId) {
        return res.status(400).json({
          ok: true,
          message: "You don't follow up yourself",
        });
      }

      const userFound = await prismaConnection.users.findUnique({
        where: {
          id: userId,
          deleted: false,
        },
      });

      if (!userFound) {
        return res.status(404).json({
          ok: false,
          message: "User not found",
        });
      }

      const followFound = await prismaConnection.follower.findFirst({
        where: {
          idFollower: user.id,
          idUser: userId,
        },
      });

      let action = "follow";

      if (followFound) {
        await prismaConnection.follower.delete({
          where: { id: followFound.id },
        });

        action = "unfollow";
      } else {
        await prismaConnection.follower.create({
          data: {
            idFollower: user.id,
            idUser: userId,
          },
        });
      }

      return res.status(200).json({
        ok: true,
        message: `${user.username} ${action} with successfully the user ${userFound.username}`,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error",
      });
    }
  }
}
