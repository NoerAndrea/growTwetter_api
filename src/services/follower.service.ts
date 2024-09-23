import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import { ToggleFollowDTO } from "../interrfaces/toggle-follower.dto";

export class FollowerService {
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
