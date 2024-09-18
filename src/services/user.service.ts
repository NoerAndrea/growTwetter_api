import { Users } from "@prisma/client";
import { prismaConnection } from "../database/prismaConnection";
import { Bcryt } from "../libs/bcrypt.lib";
import { HttpError } from "../errors/http.error";
import { CreateUserDTO } from "../interrfaces/create-user.dto";

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

  public async isUsernamerAlreadyExists(username: string): Promise<boolean> {
    const existingUsername = await prismaConnection.users.findFirst({
      where: {
        username: username,
        deleted: false,
      },
    });
    return Boolean(existingUsername);
  }
}
