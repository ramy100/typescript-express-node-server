import { Document } from "mongoose";
import UserModel from "../../models/User";
import { UserType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import UserValidation from "./UserValidation";

export default class User {
  constructor(private user: UserType) {}

  getUser() {
    return this.user;
  }

  static async getUserById(id: string) {
    if (!id) throw new Error("Invalid User Id");
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      throw new Error("User Not Found");
    }
  }

  async registerUser(repeat_password: string) {
    const result = UserValidation.validateRegisterUser(
      this.user,
      repeat_password
    );
    if (result.error) {
      throw Error(JSON.stringify(result.error.details));
    }
    const user_exists = await UserValidation.getUserIfExists(this.user.email);
    if (user_exists) {
      throw Error("Email already exists");
    }
    const hashedPass = await UserValidation.hashPassword(this.user.password);
    this.user.password = hashedPass;
    try {
      const newUser = new UserModel(this.user);
      return await newUser.save();
    } catch (error) {
      console.log(error);
      throw new Error("Register failed");
    }
  }

  async login() {
    const user = await UserValidation.getUserIfExists(this.user.email);

    if (!user) {
      throw Error("User Doesn't exist!!");
    }

    const { username, email, avatar, password } = user;

    const isCorrectPassword = await UserValidation.comparePasswordWithHash(
      this.user.password,
      password
    );

    if (!isCorrectPassword) {
      throw Error("Wrong credentials!!");
    }

    return AuthorizeUser.singUser({ username, email, avatar });
  }

  async saveUser(user: Document) {
    return await user.save();
  }
}
