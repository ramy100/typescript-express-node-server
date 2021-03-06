import { withFilter } from "apollo-server";
import { redisClient } from "../../Classes/RedisClient";
import { UserLoginType, UserRegisterType, UserType } from "../../Classes/Types";
import User from "../../Classes/Users/User";
import UserValidation from "../../Classes/Users/UserValidation";
import UserModel, { IUser } from "../../models/User";

const Query = {
  getAll: async () => {
    return await UserModel.find({}).populate("friends friendRequests");
  },
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
    if (userId)
      return await UserValidation.getUserIfExists({
        _id: userId,
        populate: true,
      });
    return null;
  },
  logout: (_: any, __: any, { token }: { token: string }) => {
    return redisClient.del(token);
  },
};

const Mutation = {
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
  del: async () => {
    try {
      await UserModel.remove({});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  register: async (_: any, registerUSer: UserRegisterType) => {
    const user = new User();
    return await user.registerUser(registerUSer);
  },
  sendFriendRequest: async (
    _: any,
    { friendId }: { friendId: string },
    { userId, pubsub }: { userId: string; pubsub: any }
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
  acceptFriendRequest: async (
    _: any,
    { friendId }: { friendId: string },
    { userId, pubsub }: { userId: string; pubsub: any }
  ) => {
    const user = new User();
    const res = await user.acceptFriendRequest(userId, friendId);
    if (res.data) {
      pubsub.publish("FRIEND_REQUEST_ACCEPTED", {
        friendRequestAccepted: res.data,
      });
    }
    return res;
  },
};

const Subscription = {
  friendRequestRecieved: {
    subscribe: withFilter(
      (_: any, __: any, { pubsub }) =>
        pubsub.asyncIterator(["FRIEND_REQUEST_RECIEVED"]),
      (
        payload: { friendRequestRecieved: { from: IUser; to: string } },
        _: any,
        { userId }: { userId: string }
      ) => {
        return userId == payload.friendRequestRecieved.to;
      }
    ),
  },
  friendRequestAccepted: {
    subscribe: withFilter(
      (_: any, __: any, { pubsub }) =>
        pubsub.asyncIterator(["FRIEND_REQUEST_ACCEPTED"]),
      (
        payload: { friendRequestAccepted: { from: IUser; to: string } },
        _: any,
        { userId }: { userId: string }
      ) => {
        return userId == payload.friendRequestAccepted.to;
      }
    ),
  },
};

export const UserResolvers = {
  Query,
  Mutation,
  Subscription,
  IResponse: {
    __resolveType() {
      return null;
    },
  },
};
