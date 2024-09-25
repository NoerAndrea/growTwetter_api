import jwt from "jsonwebtoken";
import { UserLoggedDTO } from "../interrfaces/user-logged.dto";
/**
 * @class JWT
 * Classe responsável pela geração e decodificação de tokens JWT.
 */
export class JWT {
  /**
   * Gera um token JWT com base nas informações do usuário.
   *
   * @param {UserLoggedDTO} data - Objeto contendo as informações do usuário a serem incluídas no token.
   * @param {string} data.userId - ID do usuário.
   * @param {string} data.username - Nome de usuário.
   * @returns {string} - Retorna o token JWT gerado.
   * @throws {Error} - Lança um erro se a variável de ambiente `JWT_SECRET` não estiver definida.
   *
   * @example
   * const jwtService = new JWT();
   * const token = jwtService.generateToken({ userId: 'user123', username: 'johndoe' });
   * console.log(token);
   */
  public generateToken(data: UserLoggedDTO): string {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET env is requeired.");
    }

    const token = jwt.sign(data, secretKey, { expiresIn: "1h" });
    return token;
  }
  /**
   * Decodifica um token JWT e retorna as informações do usuário.
   *
   * @param {string} token - Token JWT a ser decodificado.
   * @returns {UserLoggedDTO | null} - Retorna as informações do usuário decodificadas do token, ou `null` se o token não for válido.
   *
   * @example
   * const jwtService = new JWT();
   * const data = jwtService.decodedToken('your_jwt_token');
   * console.log(data);
   */
  public decodedToken(token: string): UserLoggedDTO | null {
    try {
      const data = jwt.decode(token) as UserLoggedDTO;

      return data;
    } catch (error) {
      return null;
    }
  }
}
