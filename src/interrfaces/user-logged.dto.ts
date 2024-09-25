/**
 * @interface  UserLoggedDTO formato do objeto de informações de um usuário
 * @property id: identificador único de registro do usuário
 * @property username: apelido do usuário
 * @property email: email do usuário
 * @property name: nome do usuário
 */

export interface UserLoggedDTO {
  id: string;
  username: string;
  email: string;
  name: string;
}
