import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { ToggleFollowDTO } from "../interrfaces/toggle-follower.dto";
/**
 * @class FollowerService
 * Serviço responsável por gerenciar as ações de seguir e deixar de seguir usuários.
 */
export class FollowerService {
  /**
   * Alterna o estado de seguimento entre dois usuários. Se o usuário já está seguindo o outro usuário,
   * a função irá remover o seguimento; caso contrário, a função irá adicionar o seguimento.
   *
   * @param {ToggleFollowDTO} input - Objeto contendo as informações necessárias para alternar o seguimento.
   * @param {Users} input.user - O usuário que está realizando a ação de seguir ou deixar de seguir.
   * @param {string} input.userId - ID do usuário que será seguido ou deixado de seguir.
   * @returns {Promise<{ action: string; message: string }>} - Retorna um objeto contendo a ação realizada (`follow` ou `unfollow`) e uma mensagem de sucesso.
   * @throws {HttpError} - Lança um erro com status 400 se o usuário tentar seguir a si mesmo, ou com status 404 se o usuário a ser seguido não for encontrado.
   *
   * @example
   * const followerService = new FollowerService();
   * const result = await followerService.toggle({ user: currentUser, userId: '123' });
   * console.log(result.action); // "follow" ou "unfollow"
   * console.log(result.message); // "Successfully followed user username" ou "Successfully unfollowed user username"
   */
  public async toggle(
    input: ToggleFollowDTO
  ): Promise<{ action: string; message: string }> {
    const { user, userId } = input;

    if (user.id === userId) {
      throw new HttpError("You can't follow yourself", 400);
    }

    const userFound = await prismaConnection.users.findUnique({
      where: {
        id: userId,
        deleted: false,
      },
    });

    if (!userFound) {
      throw new HttpError("User not found or has been deleted", 404);
    }

    const followFound = await prismaConnection.follower.findFirst({
      where: {
        idFollower: user.id,
        idUser: userId,
      },
    });

    let action = "follow";

    if (followFound) {
      await prismaConnection.follower.delete({
        where: { id: followFound.id },
      });
      action = "unfollow";
    } else {
      await prismaConnection.follower.create({
        data: {
          idFollower: user.id,
          idUser: userId,
        },
      });
    }
    return {
      action,
      message: `Successfully ${action}ed user ${userFound.username}`,
    };
  }
}
