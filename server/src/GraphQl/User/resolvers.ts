import { PubSub, withFilter } from "apollo-server";
import { redisClient } from "../../Classes/RedisClient";
import { UserLoginType, UserRegisterType, UserType } from "../../Classes/Types";
import User from "../../Classes/Users/User";
import UserValidation from "../../Classes/Users/UserValidation";
import UserModel, { IUser } from "../../models/User";
const pubsub = new PubSub();

export const UserResolvers = {
  Query: {
    users: (
      _: any,
      { pageNum }: { pageNum: number },
      { userId }: { userId: string }
    ) => User.getNonFriends(userId, pageNum),
    login: async (_: any, LoginUser: UserLoginType) => {
      const user = new User();
      return await user.login(LoginUser);
    },
    user: async (_: any, __: any, { userId }: { userId: string }) => {
      if (userId) return await UserValidation.getUserIfExists({ _id: userId });
      return null;
    },
    logout: (_: any, __: any, { token }: { token: string }) => {
      return redisClient.del(token);
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
      { userId }: { userId: string }
    ) => {
      const user = new User();
      const res = await user.sendFriendRequest(userId, friendId);
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
          { userId }: { userId: string }
        ) => {
          return userId == payload.friendRequestRecieved.to;
        }
      ),
    },
  },
};
