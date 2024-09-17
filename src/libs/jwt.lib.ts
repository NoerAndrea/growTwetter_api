import jwt from "jsonwebtoken";
import { UserLoggedDTO } from "../interrfaces/user-logged.dto";

export class JWT {
  public generateToken(data: UserLoggedDTO): string {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET env is requeired.");
    }

    const token = jwt.sign(data, secretKey, { expiresIn: "1h" });
    return token;
  }
  public decodedToken(token: string): UserLoggedDTO | null {
    try {
      const data = jwt.decode(token) as UserLoggedDTO;

      return data;
    } catch (error) {
      return null;
    }
  }
}
