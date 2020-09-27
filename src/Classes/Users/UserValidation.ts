import Joi from "joi";
import UserModel from "../../models/User";
import { UserRegisterType } from "../Types";
import bcrypt from "bcrypt";

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

  static async getUserIfExists(email: string) {
    return await UserModel.findOne({ email });
  }

  static async comparePasswordWithHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
