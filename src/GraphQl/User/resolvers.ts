import { UserLoginType, UserRegisterType } from "../../Classes/Types";
import User from "../../Classes/Users/User";
import UserModel from "../../models/User";

export const UserResolvers = {
  Query: {
    users: () => User.getALl(),
    login: async (_: any, LoginUser: UserLoginType) => {
      const user = new User();
      return await user.login(LoginUser);
    },
  },
  Mutation: {
    register: async (_: any, registerUSer: UserRegisterType) => {
      const user = new User();
      return await user.registerUser(registerUSer);
    },
    deleteAll: async () => {
      try {
        await UserModel.updateMany(
          {},
          { $set: { friendRequests: [], friends: [] } }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    sendFriendRequest: async (
      _: any,
      { friendId }: { friendId: string },
      { token }: { token: string }
    ) => {
      const user = new User();
      return await user.sendFriendRequest(token, friendId);
    },
  },
};
