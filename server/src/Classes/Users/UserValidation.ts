import Joi from "joi";
import UserModel from "../../models/User";
import { UserLoginType, UserRegisterType } from "../Types";
import bcrypt from "bcrypt";
import { IUser } from "../../models/User";

export default class UserValidation {
  static validateRegisterUser(user: UserRegisterType) {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().required().min(3).max(30).alphanum().messages({
        "string.base": `password should be Text`,
        "string.alphanum": `password should contain only characters and numbers`,
        "string.empty": `password cannot be empty`,
        "string.min": `password should have a minimum length of {#limit}`,
        "string.max": `password should have a maximum length of {#limit}`,
        "string.required": `password is a required`,
      }),

      repeat_password: Joi.ref("password"),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      avatar: Joi.string(),
    }).with("password", "repeat_password");

    return schema.validate(user, { abortEarly: false });
  }

  static validateLoginUser(user: UserLoginType) {
    const schema = Joi.object({
      password: Joi.string().required().min(3).max(30).messages({
        "string.base": `password should be Text`,
        "string.empty": `password cannot be empty`,
        "string.min": `password should have a minimum length of {#limit}`,
        "string.max": `password should have a maximum length of {#limit}`,
        "string.required": `password is a required`,
      }),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      avatar: Joi.string(),
    });

    return schema.validate(user, { abortEarly: false });
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
