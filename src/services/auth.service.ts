import { prismaConnection } from "../database/prismaConnection";
import { HttpError } from "../errors/http.error";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "../interrfaces/login-user.dto";
import { Bcryt } from "../libs/bcrypt.lib";
import { JWT } from "../libs/jwt.lib";

export class AuthService {
  public async loginUser(
    input: LoginUserInputDTO
  ): Promise<LoginUserOutputDTO> {
    const userFound = await prismaConnection.users.findUnique({
      where: {
        email: input.email,
        deleted: false,
      },
    });
    //verifica email
    if (!userFound) {
      throw new HttpError("Invalid Credentials", 401);
    }
    //verifica senha
    const bcrypt = new Bcryt();
    const isMatch = await bcrypt.verify(userFound.password, input.password);

    if (!isMatch) {
      throw new HttpError("Invalid Credentials", 401);
    }

    const jwt = new JWT();
    const token = jwt.generateToken({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      username: userFound.username,
    });
    return { authToken: token };
  }
}
