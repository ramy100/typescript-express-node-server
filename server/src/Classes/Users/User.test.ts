import Joi from "joi";
import UserModel from "../../models/User";
import { UserLoginType, UserRegisterType, UserType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import User from "./User";
import UserClass from "./User";
import UserValidation from "./UserValidation";

const getRegisterUser = (
  username: string,
  without?: {
    withouttUsername?: boolean;
    withouttEmail?: boolean;
    withouttPassword?: boolean;
    withouttRepeat_password?: boolean;
    withouttAvatar?: boolean;
  }
): UserRegisterType => ({
  username: without?.withouttUsername ? "" : username,
  email: without?.withouttEmail ? "" : `${username}@hotmail.com`,
  password: without?.withouttPassword ? "" : "123456",
  repeat_password: without?.withouttRepeat_password ? "" : "123456",
  avatar: without?.withouttAvatar ? "" : "avatar.jpg",
});

const getLoginUser = (username: string): UserLoginType => ({
  email: `${username}@hotmail.com`,
  password: "123456",
});

const getUserModelDocument = (username: string) => {
  return new UserModel({
    username,
    email: `${username}@hotmail.com`,
    password: "123456",
  });
};

describe("Register User Tests", () => {
  it("should register a user ", async () => {
    const registerUser = getRegisterUser("ramy");
    const user = new UserClass();
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    UserModel.prototype.save = jest.fn().mockReturnThis();
    const res = await user.registerUser(registerUser);
    expect(res).toMatchObject({
      username: registerUser.username,
      email: registerUser.email,
    });
  });

  it("should throws error if email exists ", async () => {
    const registerUSer = getRegisterUser("ramy");
    const user = new UserClass();
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(true);
    try {
      await user.registerUser(registerUSer);
    } catch (error) {
      expect(error.message).toEqual("Email already exists");
    }
  });

  it("should throws error if no email provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttEmail: true });
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("email");
    }
  });

  it("should throws error if no username provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttUsername: true });
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("username");
    }
  });

  it("should throw four errors for required fields", async () => {
    const registerUser = getRegisterUser("ramy", {
      withouttUsername: true,
      withouttAvatar: true,
      withouttPassword: true,
      withouttEmail: true,
      withouttRepeat_password: true,
    });
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      const errors: Joi.ValidationErrorItem[] = JSON.parse(error.message);
      expect(errors).toHaveLength(4);
    }
  });

  it("should throws error if empty password provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttPassword: true });
    const { username, repeat_password } = registerUser;
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toEqual(
        "password cannot be empty"
      );
    }
  });

  it("should throws error if empty password confirmation", async () => {
    const registerUser = getRegisterUser("ramy", {
      withouttRepeat_password: true,
    });
    const user = new UserClass();
    const { username } = registerUser;
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if wrong password confirmation", async () => {
    const registerUser = getRegisterUser("ramy");
    registerUser.repeat_password = "wrong password confrimation";
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if null password confirmation", async () => {
    const registerUser = getRegisterUser("ramy");
    registerUser.repeat_password = (null as unknown) as string;
    const user = new UserClass();
    try {
      await user.registerUser(registerUser);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });
});

describe("Login Users", () => {
  it("should Login User", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const loginUSer = getLoginUser("ramy");
    const user = new UserClass();
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(true);
    const res = await user.login(loginUSer);
    expect(res).toBeTruthy();
  });

  it("should Not Login User If Not Found", async () => {
    const loginUSer = getLoginUser("ramy");
    const user = new UserClass();
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    try {
      await user.login(loginUSer);
    } catch (error) {
      expect(error.message).toEqual("User Doesn't exist!!");
    }
  });

  it("should Not Login User If Wrong Password", async () => {
    const loginUSer = getLoginUser("ramy");
    const UserModelDoc = getUserModelDocument("ramy");
    const user = new UserClass();
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(UserModelDoc);
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(false);
    try {
      await user.login(loginUSer);
    } catch (error) {
      expect(error.message).toEqual("Wrong credentials!!");
    }
  });
});
describe("UserValidation", () => {
  it("should return token with user ", () => {
    const userModelDoc = getUserModelDocument("ramy").toObject();
    const res = AuthorizeUser.singUser(userModelDoc);
    expect(res).toBeTruthy();
  });
});
describe("Send friend requests", () => {
  it("should not send friend request if user not found", async () => {
    const userModelDoc = getUserModelDocument("soso");
    AuthorizeUser.verifyUser = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.getUserIfExists = jest.fn().mockReturnValueOnce(null);
    const user = new User();
    try {
      await user.sendFriendRequest(userModelDoc, "ramy@hotmail.com");
    } catch (error) {
      expect(error.message).toEqual("User doesn't exist");
    }
  });

  it("should not send friend request if friend not found", async () => {
    const userModelDoc = getUserModelDocument("soso");
    AuthorizeUser.verifyUser = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.getUserIfExists = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(null);
    const user = new User();
    try {
      await user.sendFriendRequest(userModelDoc, "ramy@hotmail.com");
    } catch (error) {
      expect(error.message).toEqual("User doesn't exist");
    }
  });

  it("should not send another add request", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    friendModelDoc.friendRequests.push(userModelDoc._id);
    UserValidation.getUserIfExists = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    const user = new User();
    const res = await user.sendFriendRequest(
      userModelDoc,
      friendModelDoc.email
    );
    expect(res.message).toEqual("already sent a friend request before");
  });

  it("should not send self friend request", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    AuthorizeUser.verifyUser = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(userModelDoc);
    const user = new User();
    const res = await user.sendFriendRequest(userModelDoc, userModelDoc._id);
    expect(res.message).toEqual("cannot add your self");
  });

  it("should send friend request", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    const mymock = jest.fn();
    UserValidation.getUserIfExists = mymock
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    UserModel.prototype.save = jest.fn().mockReturnThis();
    const user = new User();
    const res = await user.sendFriendRequest(userModelDoc, "ramy@hotmail.com");
    expect(res.message).toEqual("Friend Request Sent");
    expect(friendModelDoc.friendRequests.includes(userModelDoc._id)).toEqual(
      true
    );
    expect(userModelDoc.friendRequests.includes(friendModelDoc._id)).toEqual(
      false
    );
  });

  it("should become friends if already had a pending friend request from that freind", async () => {
    jest.clearAllMocks();
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    userModelDoc.friendRequests.push(friendModelDoc._id);
    AuthorizeUser.verifyUser = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.getUserIfExists = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    const user = new User();
    const res = await user.sendFriendRequest(
      userModelDoc,
      friendModelDoc.email
    );
    expect(res.message).toEqual("You are friends now");
    expect(userModelDoc.friends.includes(friendModelDoc._id)).toBeTruthy();
    expect(friendModelDoc.friends.includes(userModelDoc._id)).toBeTruthy();
    expect(
      userModelDoc.friendRequests.includes(friendModelDoc._id)
    ).toBeFalsy();
    expect(
      friendModelDoc.friendRequests.includes(userModelDoc._id)
    ).toBeFalsy();
    expect(friendModelDoc.friends.includes(friendModelDoc._id)).toBeFalsy();
    expect(userModelDoc.friends.includes(userModelDoc._id)).toBeFalsy();
  });
});
describe("Accept friend requests", () => {
  it("should throw error if no user ", async () => {
    const friendModelDoc = getUserModelDocument("soso");
    const user = new UserClass();
    UserModel.findOne = jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    try {
      await user.acceptFriendRequest("", friendModelDoc._id);
    } catch (error) {
      expect(error.message).toEqual("User Not Found");
    }
  });

  it("should throw error if no friend", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");

    const user = new UserClass();
    UserModel.findOne = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(null);
    try {
      await user.acceptFriendRequest(userModelDoc._id, friendModelDoc._id);
    } catch (error) {
      expect(error.message).toEqual("User Not Found");
    }
  });

  it("should throw error if no friend request", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    const user = new UserClass();
    UserModel.findById = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    try {
      await user.acceptFriendRequest(userModelDoc._id, friendModelDoc._id);
    } catch (error) {
      expect(error.message).toEqual(
        "You dont have friend request from this user"
      );
    }
  });

  it("should accept friend request", async () => {
    const registerUser = getRegisterUser("ramy");
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    userModelDoc.friendRequests.push(friendModelDoc._id);
    const user = new UserClass();
    UserModel.findById = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    const res = await user.acceptFriendRequest(
      userModelDoc._id,
      friendModelDoc._id
    );
    expect(res).toEqual("You are now friends");
    expect(userModelDoc.friends.includes(friendModelDoc._id)).toBeTruthy();
    expect(friendModelDoc.friends.includes(userModelDoc._id)).toBeTruthy();
    expect(
      userModelDoc.friendRequests.includes(friendModelDoc._id)
    ).toBeFalsy();
    expect(
      friendModelDoc.friendRequests.includes(userModelDoc._id)
    ).toBeFalsy();
    expect(friendModelDoc.friends.includes(friendModelDoc._id)).toBeFalsy();
    expect(userModelDoc.friends.includes(userModelDoc._id)).toBeFalsy();
  });
});
