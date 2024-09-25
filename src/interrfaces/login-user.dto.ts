/**
 * @interface LoginUserInputDTO representa o formato do objeto que carrega as informações para o login de um usuário
 */

export interface LoginUserInputDTO {
  email: string;
  password: string;
}

/**
 * @interface LoginUserOutputDTO representa o formato do objeto de resposta que contém o token de autenticação após o login de um usuário
 */
export interface LoginUserOutputDTO {
  authToken: string;
}
