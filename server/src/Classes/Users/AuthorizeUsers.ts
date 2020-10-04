import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redisClient } from "../RedisClient";
dotenv.config();

export default class AuthorizeUser {
  static singUser(userId: string) {
    try {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
      redisClient.set(token, "1");

      return token;
    } catch (error) {
      console.log(error.message);
      throw new Error("Couldnt sign user token");
    }
  }

  static verifyUser(token: string | undefined) {
    if (!token) return undefined;
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as any;
    } catch (error) {
      return undefined;
    }
  }
}
