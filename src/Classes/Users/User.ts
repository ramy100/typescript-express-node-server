import { Document } from "mongoose";
import UserModel, { IUser } from "../../models/User";
import { UserLoginType, UserRegisterType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import UserValidation from "./UserValidation";

export default class User {
  constructor() {}

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

  async registerUser(registerUser: UserRegisterType) {
    const { email, password, username, avatar } = registerUser;
    const result = UserValidation.validateRegisterUser(registerUser);
    if (result.error) {
      throw Error(JSON.stringify(result.error.details));
    }
    const user_exists = await UserValidation.getUserIfExists(email);
    if (user_exists) {
      throw Error("Email already exists");
    }
    const hashedPass = await UserValidation.hashPassword(password);
    try {
      const newUser = new UserModel({
        email,
        password: hashedPass,
        username,
        avatar,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      console.log(error);
      throw new Error("Register failed");
    }
  }

  async login(loginUser: UserLoginType) {
    const user = await UserValidation.getUserIfExists(loginUser.email);
    if (!user) {
      throw Error("User Doesn't exist!!");
    }
    const {
      _id,
      username,
      email,
      avatar,
      password,
      friends,
      friendRequests,
      registered_at,
      deactivated_at,
    } = user;

    const isCorrectPassword = await UserValidation.comparePasswordWithHash(
      loginUser.password,
      password
    );

    if (!isCorrectPassword) {
      throw Error("Wrong credentials!!");
    }

    return AuthorizeUser.singUser({
      _id,
      username,
      email,
      avatar,
      friendRequests,
      friends,
      registered_at,
      deactivated_at,
    });
  }

  async sendFriendRequest(userEmail: string, friendEmail: string) {
    const user = await UserValidation.getUserIfExists(userEmail);
    const friend = await UserValidation.getUserIfExists(friendEmail);
    if (!user || !friend) throw new Error("User doesn't exist");

    const alreadyInFriendRequest = UserValidation.checkFriendRequests(
      friend,
      user
    );
    if (alreadyInFriendRequest)
      throw new Error("already sent a friend request before");

    const hasPendingFriendRequest = UserValidation.checkFriendRequests(
      user,
      friend
    );
    if (hasPendingFriendRequest) {
      this.addFriend(user, friend);
      return "You are friends now";
    }

    try {
      friend.friendRequests.push(user._id);
      await friend.save();
      return "sent friend request";
    } catch (error) {
      return "Error sending friend request";
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
    user.friendRequests = user.friendRequests.filter(
      (requestId) => requestId !== friend._id
    );
    user.friends.push(friend._id);
    friend.friends.push(user._id);
  }
}
