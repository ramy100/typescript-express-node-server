import jwt from "jsonwebtoken";
import { UserType } from "../Types";
import dotenv from "dotenv";
dotenv.config();

export default class AuthorizeUser {
  static singUser(user: UserType) {
    try {
      const token = jwt.sign(user, process.env.JWT_SECRET as string, {
        expiresIn: "10h",
      });
      return { token, user };
    } catch (error) {
      throw new Error("Couldnt sign user token");
    }
  }

  static verifyUser(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw new Error("Couldn't Verify Token!!");
    }
  }
}
