import { TweetService } from "../../../src/services/tweet.service";
import { prismaMock } from "../../config/prisma.mock";
import { TweetMock } from "../users/mock/tweet.mock";
import { HttpError } from "../../../src/errors/http.error";
import { randomUUID } from "crypto";

const fakeTweet = TweetMock.buildFakeTweet();

describe("TweetService", () => {
  const tweetService = new TweetService();

  describe("createTweet", () => {
    it("should create a new tweet successfully", async () => {
      prismaMock.tweet.create.mockResolvedValue(fakeTweet);

      const newTweet = await tweetService.createTweet({
        content: "This is a mock tweet.",
        userId: fakeTweet.userId,
        type: "REPLY",
      });

      expect(newTweet).toEqual(fakeTweet);
      expect(prismaMock.tweet.create).toHaveBeenCalledWith({
        data: {
          content: "This is a mock tweet.",
          userId: fakeTweet.userId,
          type: "REPLY",
        },
      });
    });

    it("should throw an error if content is empty", async () => {
      await expect(
        tweetService.createTweet({
          content: "",
          userId: fakeTweet.userId,
          type: "REPLY",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("updateTweet", () => {
    it("should update an existing tweet successfully", async () => {
      const updatedTweet = { ...fakeTweet, content: "Updated content" };
      prismaMock.tweet.findUnique.mockResolvedValue(fakeTweet);
      prismaMock.tweet.update.mockResolvedValue(updatedTweet);

      const result = await tweetService.updateTweet({
        tweetId: fakeTweet.id,
        userId: fakeTweet.userId,
        content: "Updated content",
      });

      expect(result).toEqual(updatedTweet);
      expect(prismaMock.tweet.update).toHaveBeenCalledWith({
        where: { id: fakeTweet.id },
        data: { content: "Updated content" },
      });
    });

    it("should throw an error if tweet is not found", async () => {
      prismaMock.tweet.findUnique.mockResolvedValue(null);

      await expect(
        tweetService.updateTweet({
          tweetId: "invalid_id",
          userId: fakeTweet.userId,
          content: "New content",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("deleteTweet", () => {
    it("should delete a tweet successfully", async () => {
      prismaMock.tweet.findUnique.mockResolvedValue(fakeTweet);
      prismaMock.tweet.delete.mockResolvedValue(fakeTweet);

      const result = await tweetService.deleteTweet({
        tweetId: fakeTweet.id,
        userId: fakeTweet.userId,
      });

      expect(result).toEqual(fakeTweet);
      expect(prismaMock.tweet.delete).toHaveBeenCalledWith({
        where: { id: fakeTweet.id },
      });
    });

    it("should throw an error if tweet is not found", async () => {
      prismaMock.tweet.findUnique.mockResolvedValue(null);

      await expect(
        tweetService.deleteTweet({
          tweetId: "invalid_id",
          userId: fakeTweet.userId,
        })
      ).rejects.toThrow(HttpError);
    });
  });
});
