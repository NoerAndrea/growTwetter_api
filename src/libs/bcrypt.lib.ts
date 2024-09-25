import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
/**
 * @class Bcryt
 * Classe responsável pela criptografia e verificação de senhas usando a biblioteca bcrypt.
 */
export class Bcryt {
  /**
   * Codifica um texto plano em uma senha criptografada usando bcrypt.
   *
   * @param {string} textPlain - O texto plano que será criptografado.
   * @returns {Promise<string>} - Retorna uma promessa que resolve para a senha criptografada.
   * @throws {Error} - Lança um erro se a variável de ambiente `BCRYPT_SALT` não estiver definida.
   * @throws {HttpError} - Lança um erro se `BCRYPT_SALT` não for um número válido.
   *
   * @example
   * const bcryptService = new Bcryt();
   * const hashedPassword = await bcryptService.encoded('myPassword123');
   * console.log(hashedPassword);
   */
  public async encoded(textPlain: string): Promise<string> {
    const salt = process.env.BCRYPT_SALT;

    if (!salt) {
      throw new Error("BCRYPT_SALT env is required.");
    }
    if (isNaN(Number(salt))) {
      throw new HttpError("BCRYPT_SALT should be a number.", 500);
    }

    const textEncrypted = await bcrypt.hash(textPlain, Number(salt));

    return textEncrypted;
  }
  /**
   * Verifica se um texto plano corresponde a uma senha criptografada usando bcrypt.
   *
   * @param {string} textEncrypted - A senha criptografada.
   * @param {string} textPlain - O texto plano que será comparado com a senha criptografada.
   * @returns {Promise<boolean>} - Retorna uma promessa que resolve para `true` se o texto plano corresponder à senha criptografada, e `false` caso contrário.
   *
   * @example
   * const bcryptService = new Bcryt();
   * const isMatch = await bcryptService.verify(hashedPassword, 'myPassword123');
   * console.log(isMatch); // true ou false
   */
  public async verify(
    textEncrypted: string,
    textPlain: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(textPlain, textEncrypted);
    return isMatch;
  }
}
