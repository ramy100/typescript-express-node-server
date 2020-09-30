import jwt from "jsonwebtoken";
import { UserType } from "../Types";
import dotenv from "dotenv";
import { IUser } from "../../models/User";
dotenv.config();

export default class AuthorizeUser {
  static singUser(user: UserType) {
    try {
      const token = jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: "10h",
      });
      return token;
    } catch (error) {
      throw new Error("Couldnt sign user token");
    }
  }

  static verifyUser(token: string | undefined) {
    if (!token) return undefined;
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
    } catch (error) {
      return undefined;
    }
  }
}
