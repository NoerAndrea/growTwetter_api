/**
 * @interface DeleteTweetDTO representa o formato do objeto que carrega as informações necessárias para excluir um tweet
 */

export interface DeleteTweetDTO {
  tweetId: string;
  userId: string;
}
