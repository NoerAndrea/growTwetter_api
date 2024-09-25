import { TypeTweet } from "@prisma/client";
import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { CreateReplyDTO } from "../interrfaces/create-reply.dto";
/**
 * @class ReplyService
 * Serviço responsável por gerenciar a criação de respostas a tweets.
 */
export class ReplyService {
  /**
   * Cria uma resposta a um tweet original. Se o tweet original existir, a resposta é criada e associada ao tweet original.
   *
   * @param {CreateReplyDTO} input - Objeto contendo as informações necessárias para criar uma resposta.
   * @param {Users} input.user - O usuário que está criando a resposta.
   * @param {string} input.content - Conteúdo da resposta.
   * @param {string} input.tweetOriginalId - ID do tweet original ao qual a resposta está sendo criada.
   * @returns {Promise<{ message: string }>} - Retorna um objeto contendo uma mensagem indicando o sucesso da operação.
   * @throws {HttpError} - Lança um erro com status 404 se o tweet original não for encontrado.
   *
   * @example
   * const replyService = new ReplyService();
   * const result = await replyService.createReply({
   *   user: currentUser,
   *   content: 'This is a reply to the original tweet.',
   *   tweetOriginalId: 'tweet123'
   * });
   * console.log(result.message); // "Reply successfully created."
   */
  public async createReply(
    input: CreateReplyDTO
  ): Promise<{ message: string }> {
    const { user, content, tweetOriginalId } = input;

    const tweetFound = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetOriginalId,
        type: TypeTweet.TWEET,
      },
    });

    if (!tweetFound) {
      throw new HttpError("Original Tweet not found", 404);
    }

    const tweetReplyCreated = await prismaConnection.tweet.create({
      data: {
        userId: user.id,
        content: content,
        type: TypeTweet.REPLY,
      },
    });

    await prismaConnection.reply.create({
      data: {
        idTweetOne: tweetOriginalId,
        idTweetReply: tweetReplyCreated.id,
      },
    });
    return {
      message: "Reply successfully created.",
    };
  }
}
