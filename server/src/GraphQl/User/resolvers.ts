import { PubSub, withFilter } from "apollo-server";
import { UserLoginType, UserRegisterType, UserType } from "../../Classes/Types";
import User from "../../Classes/Users/User";
import UserModel, { IUser } from "../../models/User";
const pubsub = new PubSub();

export const UserResolvers = {
  Query: {
    users: (_: any, __: any, { currentUser }: { currentUser: UserType }) =>
      User.getAll(currentUser),
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
      { currentUser }: { currentUser: IUser }
    ) => {
      const user = new User();
      const res = await user.sendFriendRequest(currentUser, friendId);
      if (res.data) {
        pubsub.publish("FRIEND_REQUEST_RECIEVED", {
          friendRequestRecieved: res.data,
        });
      }
      return res;
    },
  },
  Subscription: {
    friendRequestRecieved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["FRIEND_REQUEST_RECIEVED"]),
        (
          payload: { friendRequestRecieved: { from: IUser; to: string } },
          variables,
          { currentUser }: { currentUser: IUser }
        ) => {
          return currentUser._id == payload.friendRequestRecieved.to;
        }
      ),
    },
  },
};
