import { Document } from "mongoose";
import { GqlResponse } from "../../Classes/GqlResponse/GqlResponse";
import UserModel, { IUser } from "../../models/User";
import { UserLoginType, UserRegisterType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import UserValidation from "./UserValidation";
export default class User {
  constructor() {}

  static async getNonFriends(userId: any, pageNum: number) {
    if (!userId) throw new Error("Unauthorized action");
    const usersPerPage = 5;
    try {
      const user = await UserModel.findById(userId).select(
        "friends friendRequests"
      );
      const { friendRequests, friends } = user as IUser;
      const users = await UserModel.find({
        friendRequests: { $nin: [...friends, ...friendRequests] },
      })
        .sort("regeisterd_at")
        .limit(usersPerPage)
        .skip(pageNum * usersPerPage);
      return users;
    } catch (error) {
      return new Error("Couldn't get all users");
    }
  }

  async registerUser(registerUser: UserRegisterType) {
    const { email, password, username, avatar } = registerUser;
    const result = UserValidation.validateRegisterUser(registerUser);
    if (result.error) {
      throw Error(JSON.stringify(result.error.details));
    }
    const user_exists = await UserValidation.getUserIfExists({ email });
    if (user_exists) {
      throw Error("Email already exists");
    }
    const hashedPass = await UserValidation.hashPassword(password);
    try {
      const user = new UserModel({
        email,
        password: hashedPass,
        username,
        avatar,
      });
      await user.save();
      const { _id } = user;
      const token = AuthorizeUser.singUser(_id);
      return { token, user };
    } catch (error) {
      console.log(error);
      throw new Error("Register failed");
    }
  }

  async login(loginUser: UserLoginType) {
    const result = UserValidation.validateLoginUser(loginUser);
    if (result.error) {
      throw Error(JSON.stringify(result.error.details));
    }

    const user = await UserValidation.getUserIfExists({
      email: loginUser.email,
    });
    if (!user)
      throw new Error("Email is not registered create new account ?!!");

    const { _id, password } = user;

    const isCorrectPassword = await UserValidation.comparePasswordWithHash(
      loginUser.password,
      password
    );

    if (!isCorrectPassword) {
      throw Error("Wrong credentials!!");
    }

    const token = AuthorizeUser.singUser(_id);
    return { token, user };
  }

  async sendFriendRequest(userId: string, friendId: string) {
    if (!userId) {
      return new GqlResponse("Invalid Token", undefined, 403, false);
    }

    if (userId === friendId) {
      return new GqlResponse("cannot add your self", undefined, 403, false);
    }

    const user = await UserValidation.getUserIfExists({ _id: userId });
    const friend = await UserValidation.getUserIfExists({ _id: friendId });
    if (!user || !friend)
      return new GqlResponse("User doesn't exist", undefined, 404, false);

    const alreadyFriends = UserValidation.checkIfFriends(user, friend);

    if (alreadyFriends) {
      return new GqlResponse("You are already friends!", undefined, 403, false);
    }

    const alreadyInFriendRequest = UserValidation.checkFriendRequests(
      friend,
      user
    );

    if (alreadyInFriendRequest)
      return new GqlResponse(
        "already sent a friend request before",
        undefined,
        403,
        false
      );

    const hasPendingFriendRequest = UserValidation.checkFriendRequests(
      user,
      friend
    );
    if (hasPendingFriendRequest) {
      this.addFriend(user, friend);
      try {
        await user.save();
        await friend.save();
        return new GqlResponse("You are friends now", undefined);
      } catch (error) {
        return new GqlResponse(
          "Couldn't send friend request",
          undefined,
          500,
          false
        );
      }
    }

    try {
      friend.friendRequests.push(user._id);
      await friend.save();
      return new GqlResponse("Friend Request Sent", {
        from: user,
        to: friend._id,
      });
    } catch (error) {
      return new GqlResponse(
        "Error sending friend request",
        undefined,
        500,
        false
      );
    }
  }

  async acceptFriendRequest(userId: string, friendId: string) {
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
    if (!user || !friend) throw new Error("User Not Found");

    const inFriendRequests = UserValidation.checkFriendRequests(user, friend);
    if (!inFriendRequests)
      throw Error("You dont have friend request from this user");

    this.addFriend(user, friend);
    return "You are now friends";
  }

  async saveUser(user: Document) {
    return await user.save();
  }

  private addFriend(user: IUser, friend: IUser) {
    user.friendRequests = user.friendRequests.filter((requestId) => {
      requestId != friend._id;
    });
    friend.friendRequests = friend.friendRequests.filter((requestId) => {
      requestId != user._id;
    });
    user.friends.push(friend._id);
    friend.friends.push(user._id);
  }
}
