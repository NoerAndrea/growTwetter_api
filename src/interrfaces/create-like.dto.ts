import { Users } from "@prisma/client";
/**
 * @interface LikeDTO representa o formato do objeto que carrega as informações necessárias para criar um like.
 */
export interface LikeDTO {
  tweetId: string;
  user: Users;
}
