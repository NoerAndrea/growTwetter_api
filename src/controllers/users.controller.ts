import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { onError } from "../utils/on-error.util";
/**
 * @class UsersController
 * Controlador responsável pelas operações relacionadas a usuários, incluindo criação, listagem, atualização e exclusão de usuários.
 */
export class UsersController {
  /**
   * Cria um novo usuário.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados necessários para criar um usuário.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 201 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de criação do usuário, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /users/create
   * {
   *   "name": "John Doe",
   *   "email": "john.doe@example.com",
   *   "username": "johndoe",
   *   "password": "password123"
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Student successfully registered."
   * }
   */
  public static async create(req: Request, res: Response) {
    try {
      const { name, email, username, password } = req.body;

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
  /**
   * Lista todos os usuários.
   *
   * @static
   * @param {Request} _ - Objeto de solicitação HTTP (não são esperados parâmetros na solicitação).
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e a lista de usuários em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de listagem dos usuários, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * GET /users/list
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Successfully listed user.",
   *   "users": [
   *     {
   *       "id": "user123",
   *       "name": "John Doe",
   *       "email": "john.doe@example.com",
   *       "username": "johndoe"
   *     }
   *   ]
   * }
   */
  public static async list(_: Request, res: Response) {
    try {
      const service = new UserService();
      const users = await service.listUsers();

      return res.status(200).json({
        ok: true,
        message: "Successfully listed user.",
        users: users,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
  /**
   * Atualiza os dados de um usuário existente.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo o ID do usuário a ser atualizado e os novos dados.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de atualização do usuário, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * PUT /users/update/:userId
   * {
   *   "name": "John Smith",
   *   "username": "johnsmith"
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Successfully update user.",
   *   "user": {
   *     "id": "user123",
   *     "name": "John Smith",
   *     "username": "johnsmith"
   *   }
   * }
   */
  public static async update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, username } = req.body;

      const service = new UserService();
      const userUpdated = await service.updateUserrs({
        userId,
        name,
        username,
      });

      return res.status(200).json({
        ok: true,
        message: "Successfully update user.",
        user: userUpdated,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
  /**
   * Exclui um usuário existente.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo o ID do usuário a ser excluído.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e uma mensagem de sucesso em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se ocorrer um problema durante o processo de exclusão do usuário, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * DELETE /users/delete/:userId
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Successfully delete user.",
   *   "userDeleted": {
   *     "id": "user123",
   *     "name": "John Doe",
   *     "email": "john.doe@example.com",
   *     "username": "johndoe"
   *   }
   * }
   */
  public static async delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const service = new UserService();
      const userDeleted = await service.deleteUser(userId);

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
