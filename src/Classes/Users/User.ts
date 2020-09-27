import { Document } from "mongoose";
import UserModel from "../../models/User";
import { UserLoginType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import UserValidation from "./UserValidation";

export default class User {
  constructor(private user: UserLoginType) {}

  getUser() {
    return this.user;
  }

  static async getALl() {
    try {
      return await UserModel.find();
    } catch (error) {
      return new Error("Couldn't get all users");
    }
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

  async registerUser(
    username: string,
    repeat_password: string,
    avatar?: string
  ) {
    const registerInfo = {
      ...this.user,
      repeat_password,
      username,
      avatar,
    };
    const result = UserValidation.validateRegisterUser(registerInfo);
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
      const newUser = new UserModel({ ...this.user, username, avatar });
      await newUser.save();
      return newUser;
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

    const { username, email, avatar, password, friends, friendRequests } = user;

    const isCorrectPassword = await UserValidation.comparePasswordWithHash(
      this.user.password,
      password
    );

    if (!isCorrectPassword) {
      throw Error("Wrong credentials!!");
    }

    return AuthorizeUser.singUser({
      username,
      email,
      avatar,
      friendRequests,
      friends,
    });
  }

  async saveUser(user: Document) {
    return await user.save();
  }
}
