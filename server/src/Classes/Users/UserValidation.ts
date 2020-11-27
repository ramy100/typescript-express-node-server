import UserModel from "../../models/User";
import { UserLoginType, UserRegisterType } from "../Types";
import bcrypt from "bcrypt";
import { IUser } from "../../models/User";
import {
  loginValidationRules,
  registerValidationRules,
} from "../../utils/ValidationSchemas";

export default class UserValidation {
  static validateRegisterUser(user: UserRegisterType) {
    return registerValidationRules.validate(user, { abortEarly: false });
  }

  static validateLoginUser(user: UserLoginType) {
    return loginValidationRules.validate(user, { abortEarly: false });
  }

  static async getUserIfExists({
    email,
    _id,
    populate,
  }: {
    email?: string;
    _id?: string;
    populate?: boolean;
  }) {
    if (populate) {
      return await UserModel.findOne({ $or: [{ email }, { _id }] }).populate(
        "friends friendRequests"
      );
    } else {
      return await UserModel.findOne({ $or: [{ email }, { _id }] });
    }
  }

  static async comparePasswordWithHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static checkFriendRequests(userToCheck: IUser, friend: IUser) {
    return userToCheck.friendRequests.includes(friend._id);
  }

  static checkIfFriends(userToCheck: IUser, friend: IUser) {
    return userToCheck.friends.includes(friend._id);
  }
}
