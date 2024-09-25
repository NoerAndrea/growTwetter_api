import { Request, Response } from "express";

import { Users } from "@prisma/client";
import { FollowerService } from "../services/follower.service";
import { onError } from "../utils/on-error.util";
/**
 * @class FollowerController
 * Controlador responsável pelas operações relacionadas aos seguidores, como seguir e deixar de seguir usuários.
 */
export class FollowerController {
  /**
   * Alterna o estado de seguir ou deixar de seguir um usuário.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados necessários para alternar o status de seguir.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de alternância, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /follower/toggle/:userId
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
   *   "message": "Successfully followed user user_example"
   * }
   */
  public static async toggle(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { user } = req.body;

      if (!userId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: userId or user",
        });
      }

      const service = new FollowerService();
      const result = await service.toggle({
        user: user as Users,
        userId,
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
