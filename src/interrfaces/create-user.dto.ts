/**
 * @interface CreateUserDTO representa o formato do objeto que carrega as informações necessárias para criar um novo usuário.
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  username: string;
  password: string;
}
