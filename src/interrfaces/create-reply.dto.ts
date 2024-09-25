import { Users } from "@prisma/client";
/**
 * @interface CreateReplyDTO representa o formato do objeto que carrega as informações necessárias para criar um novo reply.
 */
export interface CreateReplyDTO {
  user: Users;
  content: string;
  tweetOriginalId: string;
}
