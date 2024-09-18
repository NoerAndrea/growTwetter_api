import bcrypt from "bcrypt";

export class Bcryt {
  public async encoded(textPlain: string): Promise<string> {
    const salt = process.env.BCRYPT_SALT;

    if (!salt) {
      throw new Error("BCRYPT_SALT env is required.");
    }
    if (isNaN(Number(salt))) {
      throw new Error("BCRYPT_SALT should be a number.");
    }

    const textEncrypted = await bcrypt.hash(textPlain, Number(salt));

    return textEncrypted;
  }

  public async verify(
    textEncrypted: string,
    textPlain: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(textPlain, textEncrypted);
    return isMatch;
  }
}
