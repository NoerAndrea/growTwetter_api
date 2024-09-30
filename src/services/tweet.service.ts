import { CreateTweetDTO } from "../interrfaces/create-tweet.dto";
import { Tweet } from "@prisma/client";
import { HttpError } from "../errors/http.error";
import { DeleteTweetDTO } from "../interrfaces/delete-tweet.dto";
import { UpdateTweetDTO } from "../interrfaces/update-tweet.dto";
import prismaConnection from "../database/prismaConnection";
/**
 * @class TweetService
 * Serviço responsável por gerenciar a criação, listagem, atualização e exclusão de tweets.
 */
export class TweetService {
  /**
   * Cria um novo tweet.
   *
   * @param {CreateTweetDTO} input - Objeto contendo as informações necessárias para criar um tweet.
   * @param {string} input.userId - ID do usuário que está criando o tweet.
   * @param {string} input.content - Conteúdo do tweet.
   * @param {TypeTweet} input.type - Tipo do tweet (por exemplo, um tweet normal ou uma resposta).
   * @returns {Promise<Tweet>} - Retorna o tweet criado.
   * @throws {HttpError} - Lança um erro com status 409 se o usuário já existir.
   *
   * @example
   * const tweetService = new TweetService();
   * const newTweet = await tweetService.createTweet({
   *   userId: 'user123',
   *   content: 'This is a new tweet!',
   *   type: TypeTweet.TWEET
   * });
   * console.log(newTweet);
   */
  public async createTweet(input: CreateTweetDTO): Promise<Tweet> {
    const { userId, content, type } = input;

    if (!content || content.trim() === "") {
      throw new HttpError("Content cannot be empty", 400);
    }

    const userExists = await this.isUsernamerAlreadyExists(input.userId);

    if (userExists) {
      throw new HttpError("User already exists.", 409);
    }

    const createTweet = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: input.type,
      },
    });

    return createTweet;
  }
  /**
   * Lista todos os tweets de um usuário.
   *
   * @param {string} userId - ID do usuário cujos tweets serão listados.
   * @returns {Promise<Tweet[]>} - Retorna uma lista de tweets do usuário.
   *
   * @example
   * const tweetService = new TweetService();
   * const tweets = await tweetService.listTweet('user123');
   * console.log(tweets);
   */
  public async listTweet(userId: string): Promise<Tweet[]> {
    const tweets = await prismaConnection.tweet.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: userId,
      },
      include: {
        likes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return tweets;
  }
  /**
   * Atualiza o conteúdo de um tweet.
   *
   * @param {UpdateTweetDTO} input - Objeto contendo as informações necessárias para atualizar um tweet.
   * @param {string} input.tweetId - ID do tweet que será atualizado.
   * @param {string} input.userId - ID do usuário que está atualizando o tweet.
   * @param {string} input.content - Novo conteúdo do tweet.
   * @returns {Promise<Tweet>} - Retorna o tweet atualizado.
   * @throws {HttpError} - Lança um erro com status 404 se o tweet não for encontrado ou não pertencer ao usuário.
   *
   * @example
   * const tweetService = new TweetService();
   * const updatedTweet = await tweetService.updateTweet({
   *   tweetId: 'tweet123',
   *   userId: 'user123',
   *   content: 'Updated tweet content.'
   * });
   * console.log(updatedTweet);
   */
  public async updateTweet(input: UpdateTweetDTO): Promise<Tweet> {
    const { tweetId, userId, content } = input;

    const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetId,
        userId: userId,
      },
    });

    if (!tweetIsFromTheUser) {
      throw new HttpError(
        "Tweet not found or does not belong to the user.",
        404
      );
    }

    const updateTweet = await prismaConnection.tweet.update({
      where: { id: tweetIsFromTheUser.id },
      data: { content: content },
    });
    return updateTweet;
  }
  /**
   * Exclui um tweet.
   *
   * @param {DeleteTweetDTO} input - Objeto contendo as informações necessárias para excluir um tweet.
   * @param {string} input.tweetId - ID do tweet que será excluído.
   * @param {string} input.userId - ID do usuário que está excluindo o tweet.
   * @returns {Promise<Tweet>} - Retorna o tweet excluído.
   * @throws {HttpError} - Lança um erro com status 404 se o tweet não for encontrado ou não pertencer ao usuário.
   *
   * @example
   * const tweetService = new TweetService();
   * const deletedTweet = await tweetService.deleteTweet({
   *   tweetId: 'tweet123',
   *   userId: 'user123'
   * });
   * console.log(deletedTweet);
   */
  public async deleteTweet(input: DeleteTweetDTO): Promise<Tweet> {
    const { tweetId, userId } = input;

    const tweetIsFromTheUser = await prismaConnection.tweet.findUnique({
      where: {
        id: tweetId,
        userId: userId,
      },
    });

    if (!tweetIsFromTheUser) {
      throw new HttpError(
        "Tweet not found or does not belong to the user.",
        404
      );
    }

    const deleteTweet = await prismaConnection.tweet.delete({
      where: {
        id: tweetId,
      },
    });
    return deleteTweet;
  }
  /**
   * Verifica se um usuário com o ID fornecido já existe.
   *
   * @param {string} userId - ID do usuário a ser verificado.
   * @returns {Promise<boolean>} - Retorna `true` se o usuário existir e não estiver marcado como deletado; caso contrário, retorna `false`.
   *
   * @example
   * const tweetService = new TweetService();
   * const userExists = await tweetService.isUsernamerAlreadyExists('user123');
   * console.log(userExists); // true ou false
   */
  public async isUsernamerAlreadyExists(userId: string): Promise<boolean> {
    const existingUsername = await prismaConnection.users.findFirst({
      where: {
        id: userId,
        deleted: false,
      },
    });
    return Boolean(existingUsername);
  }
}
