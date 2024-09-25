import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { LikeDTO } from "../interrfaces/create-like.dto";
/**
 * @class LikeService
 * Serviço responsável por gerenciar as ações de curtir e descurtir tweets.
 */
export class LikeService {
  /**
   * Adiciona ou remove um "like" de um tweet. Se o usuário já curtiu o tweet, a ação remove o "like";
   * caso contrário, a ação adiciona o "like".
   *
   * @param {LikeDTO} input - Objeto contendo as informações necessárias para adicionar ou remover um "like".
   * @param {string} input.tweetId - ID do tweet que será curtido ou descurtido.
   * @param {Users} input.user - O usuário que está curtindo ou descurtindo o tweet.
   * @returns {Promise<{ message: string }>} - Retorna um objeto contendo uma mensagem que indica o resultado da operação.
   * @throws {HttpError} - Lança um erro com status 404 se o tweet não for encontrado.
   *
   * @example
   * const likeService = new LikeService();
   * const result = await likeService.createLike({ tweetId: 'tweet123', user: currentUser });
   * console.log(result.message); // "Tweet successfully liked." ou "Like removed successfully."
   */
  public async createLike(input: LikeDTO): Promise<{ message: string }> {
    const { tweetId, user } = input;

    const tweetFound = await prismaConnection.tweet.findFirst({
      where: { id: tweetId },
    });

    if (!tweetFound) {
      throw new HttpError("Tweet not found", 404);
    }

    const likeExists = await prismaConnection.like.findFirst({
      where: {
        tweetId: tweetId,
        userId: user.id,
      },
    });

    if (likeExists) {
      await prismaConnection.like.delete({
        where: { id: likeExists.id },
      });

      return {
        message: "Like removed successfully.",
      };
    }

    await prismaConnection.like.create({
      data: {
        tweetId: tweetId,
        userId: user.id,
      },
    });

    return {
      message: "Tweet successfully liked.",
    };
  }
}
