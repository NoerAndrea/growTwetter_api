import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "../interrfaces/login-user.dto";
import { Bcryt } from "../libs/bcrypt.lib";
import { JWT } from "../libs/jwt.lib";
/**
 * @class AuthService - autenticação de usuários
 */

export class AuthService {
  /**
   * Método responsável pelo login de um usuário. Ele valida o email e a senha, e se as credenciais
   * forem corretas, gera e retorna um token JWT que será usado para autenticação futura.
   *
   * @param {LoginUserInputDTO} input - Objeto contendo as credenciais de login do usuário (email e senha).
   * @returns {Promise<LoginUserOutputDTO>} - Retorna um objeto contendo o token de autenticação (authToken) se o login for bem-sucedido.
   * @throws {HttpError} - Lança um erro com status 401 caso as credenciais sejam inválidas.
   *
   * @example
   * const authService = new AuthService();
   * const loginData = { email: 'usuario@example.com', password: 'senha123' };
   * const result = await authService.loginUser(loginData);
   * console.log(result.authToken); // Token JWT para autenticação
   */
  public async loginUser(
    input: LoginUserInputDTO
  ): Promise<LoginUserOutputDTO> {
    const userFound = await prismaConnection.users.findUnique({
      where: {
        email: input.email,
        deleted: false,
      },
    });
    /**
     * Lança um erro HTTP se o usuário não for encontrado.
     *
     * @throws {HttpError} - Lança um erro com a mensagem "Invalid Credentials" e o código de status 401,
     * indicando que as credenciais fornecidas são inválidas porque o usuário não existe.
     */
    if (!userFound) {
      throw new HttpError("Invalid Credentials", 401);
    }

    const bcrypt = new Bcryt();
    /**
     * @method isMatch Verifica se a senha fornecida corresponde à senha armazenada no banco de dados.
     *
     * @param {string} userFound.password - Senha armazenada no banco de dados do usuário.
     * @param {string} input.password - Senha fornecida pelo usuário para autenticação.
     * @returns {Promise<boolean>} - Retorna uma `Promise` que resolve para um booleano indicando se a senha fornecida corresponde à senha armazenada.
     * @throws {Error} - Lança um erro se houver problemas na verificação da senha.
     */
    const isMatch = await bcrypt.verify(userFound.password, input.password);

    if (!isMatch) {
      throw new HttpError("Invalid Credentials", 401);
    }
    /**
     *@method JWT Gera um token JWT contendo informações do usuário para autenticação futura.
     * @returns {string} - Retorna o token JWT gerado que pode ser usado para autenticação.
     */
    const jwt = new JWT();

    const token = jwt.generateToken({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      username: userFound.username,
    });
    return { authToken: token };
  }
}
