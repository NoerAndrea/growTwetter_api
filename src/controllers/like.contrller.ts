import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";

export class LikeController {
  public static async create(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      // o Tweet ID tem que ser válido
      const tweetFound = await prismaConnection.tweet.findFirst({
        where: { id: tweetId },
      });

      if (!tweetFound) {
        return res.status(404).json({
          ok: false,
          message: "Tweet not found.",
        });
      }

      // Um usuario não poderá curtir duas vezes o mesmo Tweet
      const likeExists = await prismaConnection.like.findFirst({
        where: {
          tweetId: tweetId,
          userId: (user as Users).id,
        },
      });

      // Se o usuário logado já tiver curtido, remove o like
      if (likeExists) { 
        await prismaConnection.like.delete({
          where: { id: likeExists.id }
        })

        return res.status(200).json({
          ok: true,
          message: "Like removed successfully.",
        });
      }

      // Se o usuário logado não tiver curtido, adiciona o like
      await prismaConnection.like.create({
          data: {
            tweetId: tweetId,
            userId: (user as Users).id,
          },
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet successfully liked.",
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }
}
