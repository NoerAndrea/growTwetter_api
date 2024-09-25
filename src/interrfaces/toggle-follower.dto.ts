import { Users } from "@prisma/client";
/**
 * @interface ToggleFollowDTO representa o formato do objeto que carrega as informações para seguir ou deixar de seguir um usuário.
 * @property userId: identificador do usuário
 * @property user: usuário
 */
export interface ToggleFollowDTO {
  user: Users;
  userId: string;
}
