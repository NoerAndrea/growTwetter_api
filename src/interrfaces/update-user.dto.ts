/**
 * @interface UpdateUserDTO representa o formato do objeto que carrega as informações para atualizar um usuário.
 * @property userId: identificador do usuário
 * @property username: apelido do usuário à ser atualizado
 * @property name: nome do usuário à ser atualizado
 */
export interface UpdateUserDTO {
  userId: string;
  name?: string;
  username?: string;
}
