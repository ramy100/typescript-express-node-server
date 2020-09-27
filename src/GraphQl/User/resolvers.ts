import { UserLoginType, UserRegisterType } from "../../Classes/Types";
import User from "../../Classes/Users/User";

export const UserResolvers = {
  Query: {
    users: () => User.getALl(),
    login: async (_: any, { email, password }: UserLoginType) => {
      const user = new User({ email, password });
      return await user.login();
    },
  },
  Mutation: {
    register: async (
      _: any,
      { username, email, password, repeat_password }: UserRegisterType
    ) => {
      const user = new User({ email, password });
      return await user.registerUser(username, repeat_password);
    },
  },
};
