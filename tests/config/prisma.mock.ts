import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import prismaConnection from "../../src/database/prismaConnection";

export const prismaMock =
  prismaConnection as unknown as DeepMockProxy<PrismaClient>;

jest.mock("../../src/database/prismaConnection", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});
