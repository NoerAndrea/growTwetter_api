import { Users } from "@prisma/client";
import { randomUUID } from "crypto";

export class UserMock {
  public static buildFakeUser(): Users {
    return {
      id: randomUUID(),
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      password: "hashedPassword123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      deletedAt: null,
    };
  }
}
