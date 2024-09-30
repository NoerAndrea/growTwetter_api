import { Users } from "@prisma/client";
import { Bcryt } from "../libs/bcrypt.lib";
import { HttpError } from "../errors/http.error";
import { CreateUserDTO } from "../interrfaces/create-user.dto";
import { UpdateUserDTO } from "../interrfaces/update-user.dto";
import prismaConnection from "../database/prismaConnection";
/**
 * @class UserService
 * Serviço responsável por gerenciar usuários, incluindo criação, listagem, atualização e exclusão.
 */
export class UserService {
  /**
   * Cria um novo usuário.
   *
   * @param {CreateUserDTO} input - Objeto contendo as informações necessárias para criar um usuário.
   * @param {string} input.name - Nome do usuário.
   * @param {string} input.email - Email do usuário.
   * @param {string} input.username - Nome de usuário.
   * @param {string} input.password - Senha do usuário.
   * @returns {Promise<Users>} - Retorna o usuário criado.
   * @throws {HttpError} - Lança um erro com status 409 se o nome de usuário já existir.
   *
   * @example
   * const userService = new UserService();
   * const newUser = await userService.createUser({
   *   name: 'John Doe',
   *   email: 'john.doe@example.com',
   *   username: 'johndoe',
   *   password: 'password123'
   * });
   * console.log(newUser);
   */
  public async createUser(input: CreateUserDTO): Promise<Users> {
    const usernameExists = await this.isUsernamerAlreadyExists(input.username);

    if (usernameExists) {
      throw new HttpError("Username exist.", 409);
    }

    const bcrypt = new Bcryt();
    const hash = await bcrypt.encoded(input.password);

    const newUser = await prismaConnection.users.create({
      data: {
        name: input.name,
        email: input.email,
        username: input.username,
        password: hash,
      },
    });

    return newUser;
  }
  /**
   * Lista todos os usuários não deletados.
   *
   * @returns {Promise<Users[]>} - Retorna uma lista de usuários.
   * @throws {HttpError} - Lança um erro com status 404 se nenhum usuário for encontrado.
   *
   * @example
   * const userService = new UserService();
   * const users = await userService.listUsers();
   * console.log(users);
   */
  public async listUsers(): Promise<Users[]> {
    const users = await prismaConnection.users.findMany({
      where: { deleted: false },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tweets: true,
        likes: true,
      },
    });

    if (users.length === 0) {
      throw new HttpError("No users found", 404);
    }
    return users;
  }
  /**
   * Atualiza informações de um usuário existente.
   *
   * @param {UpdateUserDTO} input - Objeto contendo as informações a serem atualizadas.
   * @param {string} input.userId - ID do usuário a ser atualizado.
   * @param {string} [input.name] - Novo nome do usuário (opcional).
   * @param {string} [input.username] - Novo nome de usuário (opcional).
   * @returns {Promise<Users>} - Retorna o usuário atualizado.
   * @throws {HttpError} - Lança um erro com status 404 se o usuário não for encontrado ou com status 409 se o nome de usuário já estiver em uso.
   *
   * @example
   * const userService = new UserService();
   * const updatedUser = await userService.updateUserrs({
   *   userId: 'user123',
   *   name: 'Jane Doe',
   *   username: 'janedoe'
   * });
   * console.log(updatedUser);
   */
  public async updateUserrs(input: UpdateUserDTO): Promise<Users> {
    const userFound = await this.getUserById(input.userId);

    if (input.username) {
      const usernameExist = await this.isUsernamerAlreadyExists(input.username);

      if (usernameExist) {
        throw new HttpError("Username used, create another one.", 409);
      }
      userFound.username = input.username;
    }

    if (input.name) {
      userFound.name = input.name;
    }

    const userUpdated = await prismaConnection.users.update({
      where: {
        id: userFound.id,
      },
      data: {
        name: userFound.name,
        username: userFound.username,
      },
    });
    return userUpdated;
  }
  /**
   * Exclui um usuário, marcando-o como deletado.
   *
   * @param {string} id - ID do usuário a ser excluído.
   * @returns {Promise<Users>} - Retorna o usuário excluído.
   * @throws {HttpError} - Lança um erro com status 404 se o usuário não for encontrado.
   *
   * @example
   * const userService = new UserService();
   * const deletedUser = await userService.deleteUser('user123');
   * console.log(deletedUser);
   */
  public async deleteUser(id: string): Promise<Users> {
    const userFound = await this.getUserById(id);

    const userDeleted = await prismaConnection.users.update({
      where: { id: userFound.id, deleted: false },
      data: { deleted: true, deletedAt: new Date() },
    });
    return userDeleted;
  }
  /**
   * Verifica se um nome de usuário já existe.
   *
   * @param {string} username - Nome de usuário a ser verificado.
   * @returns {Promise<boolean>} - Retorna `true` se o nome de usuário já existir; caso contrário, retorna `false`.
   *
   * @example
   * const userService = new UserService();
   * const usernameExists = await userService.isUsernamerAlreadyExists('johndoe');
   * console.log(usernameExists); // true ou false
   */
  public async isUsernamerAlreadyExists(username: string): Promise<boolean> {
    const existingUsername = await prismaConnection.users.findFirst({
      where: {
        username: username,
        deleted: false,
      },
    });
    return Boolean(existingUsername);
  }
  /**
   * Recupera um usuário pelo ID.
   *
   * @param {string} id - ID do usuário a ser recuperado.
   * @returns {Promise<Users>} - Retorna o usuário encontrado.
   * @throws {HttpError} - Lança um erro com status 404 se o usuário não for encontrado.
   *
   * @example
   * const userService = new UserService();
   * const user = await userService.getUserById('user123');
   * console.log(user);
   */
  public async getUserById(id: string): Promise<Users> {
    const userUpdated = await prismaConnection.users.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!userUpdated) {
      throw new HttpError("No users found", 404);
    }

    return userUpdated;
  }
}
