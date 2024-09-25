import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { onError } from "../utils/on-error.util";
/**
 * @class AuthController
 * Controlador responsável pelas operações de autenticação de usuários.
 */
export class AuthController {
  /**
   * Realiza o login do usuário com base no email e senha fornecidos.
   *
   * @static
   * @param {Request} req - Objeto de solicitação HTTP contendo os dados do usuário.
   * @param {Response} res - Objeto de resposta HTTP usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>} - Retorna uma promessa que resolve para a resposta HTTP com um status de 200 e um token de autenticação em caso de sucesso, ou uma resposta de erro em caso de falha.
   * @throws {Error} - Lança um erro se a autenticação falhar, que é tratado pelo middleware `onError`.
   *
   * @example
   * // Exemplo de solicitação:
   * POST /login
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   *
   * // Exemplo de resposta:
   * {
   *   "ok": true,
   *   "message": "Aluno autenticado",
   *   "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const service = new AuthService();
      const { authToken } = await service.loginUser({
        email,
        password,
      });

      return res.status(200).json({
        ok: true,
        message: "Aluno autenticado",
        authToken,
      });
    } catch (err) {
      return onError(err, res);
    }
  }
}
