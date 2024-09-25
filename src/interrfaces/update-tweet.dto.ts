/**
 * @interface UpdateTweetDTO representa o formato do objeto que carrega as informações para atualizar um tweet.
 * @property userId: identificador do usuário
 * @property tweetId: identificador do tweet
 * @property content: conteúdo do tweet
 */
export interface UpdateTweetDTO {
  tweetId: string;
  userId: string;
  content: string;
}
