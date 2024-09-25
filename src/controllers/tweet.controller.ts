import { Users } from "@prisma/client";
import { Request, Response } from "express";
import { prismaConnection } from "../database/prismaConnection";
import { TweetService } from "../services/tweet.service";
import { onError } from "../utils/on-error.util";
/**
 * @class TweetController
 * Controlador responsável pelas operações relacionadas a tweets, incluindo criação, listagem, atualização e exclusão de tweets.
 */
export class TweetController {
  /**
   * Cria um novo tweet.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados necessários para criar um tweet.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 201 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de criação do tweet, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /tweet/create
   * {
   *   "content": "This is a new tweet.",
   *   "type": "tweet",
   *   "user": {
   *     "id": "user123",
   *     "username": "user_example"
   *   }
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Tweet successfully created for the user user_example",
   *   "tweet": {
   *     "id": "tweet123",
   *     "content": "This is a new tweet.",
   *     "type": "tweet",
   *     "userId": "user123",
   *     "createdAt": "2024-09-24T00:00:00Z"
   *   }
   * }
   */
  public static async create(req: Request, res: Response) {
    try {
      const { user, content, type } = req.body;

      if (!user || !content || !type) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: user, content, or type",
        });
      }

      const service = new TweetService();
      const createTweet = await service.createTweet({
        content,
        type,
        userId: (user as Users).id,
      });

      return res.status(201).json({
        ok: true,
        message: `Tweet successfully created for the user ${
          (user as Users).username
        }`,
        tweet: createTweet,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
  /**
   * Lista todos os tweets de um usuário específico.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo o ID do usuário cujos tweets devem ser listados.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e a lista de tweets em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de listagem dos tweets, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * GET /tweet/list
   * {
   *   "user": {
   *     "id": "user123"
   *   }
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "user": {
   *     "id": "user123",
   *     "username": "user_example"
   *   },
   *   "tweets": [
   *     {
   *       "id": "tweet123",
   *       "content": "This is a tweet.",
   *       "type": "tweet",
   *       "userId": "user123",
   *       "createdAt": "2024-09-24T00:00:00Z"
   *     }
   *   ]
   * }
   */
  public static async list(req: Request, res: Response) {
    try {
      const { user } = req.body;

      if (!user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "User not provided or invalid.",
        });
      }

      const service = new TweetService();
      const tweets = await service.listTweet((user as Users).id);

      return res.status(200).json({
        ok: true,
        user: user,
        tweets: tweets,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
  /**
   * Lista todos os tweets existentes no sistema.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP (não são esperados parâmetros na solicitação).
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e a lista de todos os tweets em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de listagem dos tweets, retornando uma resposta de erro 500 em caso de falha.
   *
   * @example
   * // Exemplo de solicitação:
   * GET /tweet/listAll
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "data": [
   *     {
   *       "id": "tweet123",
   *       "content": "This is a tweet.",
   *       "type": "tweet",
   *       "userId": "user123",
   *       "createdAt": "2024-09-24T00:00:00Z",
   *       "user": {
   *         "username": "user_example",
   *         "name": "User Example"
   *       },
   *       "likes": [
   *         {
   *           "user": {
   *             "name": "Liker Example"
   *           }
   *         }
   *       ]
   *     }
   *   ]
   * }
   */
  public static async listAll(req: Request, res: Response) {
    try {
      const tweets = await prismaConnection.tweet.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
              name: true,
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        data: tweets,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        message: "Internal server error.",
      });
    }
  }
  /**
   * Atualiza um tweet existente.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo o ID do tweet a ser atualizado e o novo conteúdo.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de atualização do tweet, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * PUT /tweet/update/:tweetId
   * {
   *   "content": "Updated tweet content.",
   *   "user": {
   *     "id": "user123"
   *   }
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Tweet updated successfully.",
   *   "tweet": {
   *     "id": "tweet123",
   *     "content": "Updated tweet content.",
   *     "type": "tweet",
   *     "userId": "user123",
   *     "createdAt": "2024-09-24T00:00:00Z"
   *   }
   * }
   */
  public static async update(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { content, user } = req.body;

      if (!tweetId || !content || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId, content, or user",
        });
      }

      const service = new TweetService();
      const updateTweet = await service.updateTweet({
        tweetId,
        content,
        userId: (user as Users).id,
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet updated successfully.",
        tweet: updateTweet,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
  /**
   * Exclui um tweet existente.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo o ID do tweet a ser excluído.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de exclusão do tweet, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * DELETE /tweet/delete/:tweetId
   * {
   *   "user": {
   *     "id": "user123"
   *   }
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Tweet deleted successfully.",
   *   "tweet": {
   *     "id": "tweet123",
   *     "content": "This is a tweet.",
   *     "type": "tweet",
   *     "userId": "user123",
   *     "createdAt": "2024-09-24T00:00:00Z"
   *   }
   * }
   */
  public static async delete(req: Request, res: Response) {
    try {
      const { tweetId } = req.params;
      const { user } = req.body;

      if (!tweetId || !user || !(user as Users).id) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: tweetId or user",
        });
      }

      const service = new TweetService();
      const tweetDeleted = await service.deleteTweet({
        tweetId,
        userId: (user as Users).id,
      });

      return res.status(200).json({
        ok: true,
        message: "Tweet deleted successfully.",
        tweet: tweetDeleted,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
