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
  }
): UserRegisterType => ({
  username: without?.withouttUsername ? "" : username,
  email: without?.withouttEmail ? "" : `${username}@hotmail.com`,
  password: without?.withouttPassword ? "" : "123456",
  repeat_password: without?.withouttRepeat_password ? "" : "123456",
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
    const { username, repeat_password, email } = getRegisterUser("ramy");
    const user = new UserClass(getRegisterUser("ramy"));
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    UserModel.prototype.save = jest.fn().mockReturnThis();
    const res = await user.registerUser(username, repeat_password);
    expect(res).toMatchObject({ username, email });
  });

  it("should throws error if email exists ", async () => {
    const { username, repeat_password } = getRegisterUser("ramy");
    const user = new UserClass(getRegisterUser("ramy"));
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(true);
    try {
      await user.registerUser(username, repeat_password);
    } catch (error) {
      expect(error.message).toEqual("Email already exists");
    }
  });

  it("should throws error if no email provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttEmail: true });
    const { username, repeat_password } = registerUser;
    const user = new UserClass(registerUser);
    try {
      await user.registerUser(username, repeat_password);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("email");
    }
  });

  it("should throws error if no username provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttUsername: true });
    const { username, repeat_password } = registerUser;
    const user = new UserClass(registerUser);
    try {
      await user.registerUser(username, repeat_password);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("username");
    }
  });

  it("should throw four errors for required fields", async () => {
    const user = new UserClass({} as UserLoginType);
    try {
      await user.registerUser("", "");
    } catch (error) {
      const errors: Joi.ValidationErrorItem[] = JSON.parse(error.message);
      expect(errors).toHaveLength(4);
    }
  });

  it("should throws error if empty password provided", async () => {
    const registerUser = getRegisterUser("ramy", { withouttPassword: true });
    const { username, repeat_password } = registerUser;
    const user = new UserClass(registerUser);
    try {
      await user.registerUser(username, repeat_password);
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toEqual(
        "password cannot be empty"
      );
    }
  });

  it("should throws error if empty password confirmation", async () => {
    const registerUser = getRegisterUser("ramy");
    const user = new UserClass(registerUser);
    const { username } = registerUser;
    try {
      await user.registerUser(username, "");
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if wrong password confirmation", async () => {
    const registerUser = getRegisterUser("ramy");
    const { username } = registerUser;
    const user = new UserClass(registerUser);
    try {
      await user.registerUser(username, "wrong password");
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if null password confirmation", async () => {
    const registerUser = getRegisterUser("ramy");
    const { username } = registerUser;
    const user = new UserClass(registerUser);
    try {
      await user.registerUser(username, (null as unknown) as string);
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
    const registerUser = getRegisterUser("ramy");
    const { email, password } = registerUser;
    const user = new UserClass({ email, password });
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(userModelDoc);
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(true);
    const res = await user.login();
    expect(res).toBeTruthy();
  });

  it("should Not Login User If Not Found", async () => {
    const registerUser = getRegisterUser("ramy");
    const user = new UserClass(registerUser);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    try {
      await user.login();
    } catch (error) {
      expect(error.message).toEqual("User Doesn't exist!!");
    }
  });

  it("should Not Login User If Wrong Password", async () => {
    const registerUser = getRegisterUser("ramy");
    const user = new UserClass(registerUser);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(user.getUser());
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(false);
    try {
      await user.login();
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
    const userModelDoc = getUserModelDocument("ramy");
    UserValidation.getUserIfExists = jest.fn().mockReturnValueOnce(null);
    const user = new User(userModelDoc);
    try {
      await user.sendFriendRequest("ramy@hotmail.com");
    } catch (error) {
      expect(error.message).toEqual("User doesn't exist");
    }
  });

  it("should not send friend request if friend not found", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    UserValidation.getUserIfExists = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(null);
    const user = new User(userModelDoc);
    try {
      await user.sendFriendRequest("ramy@hotmail.com");
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
    const user = new User(userModelDoc);
    try {
      await user.sendFriendRequest(friendModelDoc.email);
    } catch (error) {
      expect(error.message).toEqual("already sent a friend request before");
    }
  });

  it("should send friend request", async () => {
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    const mymock = jest.fn();
    UserValidation.getUserIfExists = mymock
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    UserModel.prototype.save = jest.fn().mockReturnThis();
    const user = new User(userModelDoc);
    const res = await user.sendFriendRequest("ramy@hotmail.com");
    expect(res).toEqual("sent friend request");
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
    UserValidation.getUserIfExists = jest
      .fn()
      .mockReturnValueOnce(userModelDoc)
      .mockReturnValueOnce(friendModelDoc);
    const user = new User(userModelDoc);
    const res = await user.sendFriendRequest(friendModelDoc.email);
    expect(res).toEqual("You are friends now");
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
    const registerUser = getRegisterUser("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    const user = new UserClass(registerUser);
    UserModel.findOne = jest.fn().mockReturnValue(false);
    UserModel.findById = jest.fn().mockReturnValue(true);
    try {
      await user.acceptFriendRequest(friendModelDoc._id);
    } catch (error) {
      expect(error.message).toEqual("User Not Found");
    }
  });

  it("should throw error if no friend", async () => {
    const registerUser = getRegisterUser("ramy");
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");

    const user = new UserClass(registerUser);
    UserModel.findOne = jest.fn().mockReturnValue(userModelDoc);
    UserModel.findById = jest.fn().mockReturnValue(null);
    try {
      await user.acceptFriendRequest(friendModelDoc._id);
    } catch (error) {
      expect(error.message).toEqual("User Not Found");
    }
  });

  it("should throw error if no friend request", async () => {
    const registerUser = getRegisterUser("ramy");
    const userModelDoc = getUserModelDocument("ramy");
    const friendModelDoc = getUserModelDocument("soso");
    const user = new UserClass(registerUser);
    UserModel.findOne = jest.fn().mockReturnValue(userModelDoc);
    UserModel.findById = jest.fn().mockReturnValue(friendModelDoc);
    try {
      await user.acceptFriendRequest(friendModelDoc._id);
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
    const user = new UserClass(registerUser);
    UserModel.findOne = jest.fn().mockReturnValue(userModelDoc);
    UserModel.findById = jest.fn().mockReturnValue(friendModelDoc);
    const res = await user.acceptFriendRequest(friendModelDoc._id);
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
