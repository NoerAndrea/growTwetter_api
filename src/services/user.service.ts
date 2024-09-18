import { Users } from "@prisma/client";
import { prismaConnection } from "../database/prismaConnection";
import { Bcryt } from "../libs/bcrypt.lib";
import { HttpError } from "../errors/http.error";
import { CreateUserDTO } from "../interrfaces/create-user.dto";
import { UpdateUserDTO } from "../interrfaces/update-user.dto";

export class UserService {
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

  public async deleteUser(id: string): Promise<Users> {
    const userFound = await this.getUserById(id);

    const userDeleted = await prismaConnection.users.update({
      where: { id: userFound.id, deleted: false },
      data: { deleted: true, deletedAt: new Date() },
    });
    return userDeleted;
  }

  public async isUsernamerAlreadyExists(username: string): Promise<boolean> {
    const existingUsername = await prismaConnection.users.findFirst({
      where: {
        username: username,
        deleted: false,
      },
    });
    return Boolean(existingUsername);
  }

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
