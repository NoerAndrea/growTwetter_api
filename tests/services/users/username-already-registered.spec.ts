import dotenv from "dotenv";
import { UserService } from "../../../src/services/user.service";
import { prismaMock } from "../../config/prisma.mock";
import { UserMock } from "../users/mock/user.mock";
import { HttpError } from "../../../src/errors/http.error";

import { Bcryt } from "../../../src/libs/bcrypt.lib";

dotenv.config();

jest.mock("../../../src/libs/bcrypt.lib", () => {
  return {
    Bcryt: jest.fn().mockImplementation(() => {
      return {
        encoded: jest.fn().mockResolvedValue("hashedPassword123"),
      };
    }),
  };
});

const fakeUser = UserMock.buildFakeUser();

describe("UserService", () => {
  const userService = new UserService();

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      prismaMock.users.findFirst.mockResolvedValue(null);
      prismaMock.users.create.mockResolvedValue(fakeUser);

      const newUser = await userService.createUser({
        name: "John Doe",
        email: "john.doe@example.com",
        username: "johndoe",
        password: "password123",
      });

      expect(newUser).toEqual(fakeUser);
    });

    it("should throw an error if username already exists", async () => {
      prismaMock.users.findFirst.mockResolvedValue(fakeUser);

      await expect(
        userService.createUser({
          name: "John Doe",
          email: "john.doe@example.com",
          username: "johndoe",
          password: "password123",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("updateUserrs", () => {
    it("should update user information", async () => {
      const userId = fakeUser.id;
      prismaMock.users.findUnique.mockResolvedValue(fakeUser);
      prismaMock.users.update.mockResolvedValue(fakeUser);

      const updatedUser = await userService.updateUserrs({
        userId,
        name: "Jane Doe",
        username: "janedoe",
      });

      expect(updatedUser).toEqual(fakeUser);
      expect(prismaMock.users.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: "Jane Doe", username: "janedoe" },
      });
    });

    it("should throw an error if username is already in use", async () => {
      const userId = fakeUser.id;
      prismaMock.users.findUnique.mockResolvedValue(fakeUser);
      prismaMock.users.findFirst.mockResolvedValue(fakeUser);

      await expect(
        userService.updateUserrs({
          userId,
          username: "johndoe",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("deleteUser", () => {
    it("should mark user as deleted", async () => {
      const userId = fakeUser.id;
      prismaMock.users.findUnique.mockResolvedValue(fakeUser);
      prismaMock.users.update.mockResolvedValue(fakeUser);

      const deletedUser = await userService.deleteUser(userId);

      expect(deletedUser).toEqual(fakeUser);
      expect(prismaMock.users.update).toHaveBeenCalledWith({
        where: { id: userId, deleted: false },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
    });

    it("should throw an error if user not found", async () => {
      const userId = fakeUser.id;
      prismaMock.users.findUnique.mockResolvedValue(null);

      await expect(userService.deleteUser(userId)).rejects.toThrow(HttpError);
    });
  });
});
