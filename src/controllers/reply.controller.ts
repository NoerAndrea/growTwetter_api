import { Request, Response } from "express";
import { ReplyService } from "../services/reply.service";
import { Users } from "@prisma/client";
import { onError } from "../utils/on-error.util";
/**
 * @class ReplyController
 * Controlador responsável pelas operações relacionadas às respostas (replies) a tweets, incluindo a criação de uma nova resposta.
 */
export class ReplyController {
  /**
   * Cria uma nova resposta (reply) para um tweet original.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados necessários para criar uma resposta.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 201 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de criação da resposta, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /reply/create
   * {
   *   "content": "This is a reply to the original tweet.",
   *   "tweetOriginalId": "tweet123",
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
   *   "message": "Reply successfully created."
   * }
   */
  public static async create(req: Request, res: Response) {
    try {
      const { content, tweetOriginalId } = req.body;
      const { user } = req.body;

      if (!content || !tweetOriginalId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: content, tweetOriginalId, or user",
        });
      }

      const service = new ReplyService();
      const result = await service.createReply({
        user: user as Users,
        content,
        tweetOriginalId,
      });

      return res.status(201).json({
        ok: true,
        message: result.message,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
