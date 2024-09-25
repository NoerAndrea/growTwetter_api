import { Users } from "@prisma/client";
import { Request, Response } from "express";

import { LikeService } from "../services/like.service";
import { onError } from "../utils/on-error.util";
/**
 * @class LikeController
 * Controlador responsável pelas operações relacionadas aos "likes" em tweets, como criar e remover um like.
 */
export class LikeController {
  /**
   * Cria um "like" para um tweet ou remove o "like" existente, com base na ação do usuário.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados necessários para criar ou remover um "like".
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de criação ou remoção do "like", que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /like/create/:tweetId
   * {
   *   "user": {
   *     "id": "user123",
   *     "username": "user_example",
   *     "name": "User Example",
   *     "email": "user@example.com"
   *   }
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Tweet successfully liked."
   * }
   */
  public static async create(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      if (!tweetId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId or user",
        });
      }

      const service = new LikeService();
      const result = await service.createLike({
        tweetId,
        user: user as Users,
      });

      return res.status(200).json({
        ok: true,
        message: result.message,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
