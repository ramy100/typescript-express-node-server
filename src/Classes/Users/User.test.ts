import Joi from "joi";
import UserModel from "../../models/User";
import { UserType, UserWithoutPasswordType } from "../Types";
import AuthorizeUser from "./AuthorizeUsers";
import UserClass from "./User";
import UserValidation from "./UserValidation";

const validUserWithPassword: UserType = {
  username: "ramy",
  email: "ramy@hotmail.com",
  password: "123456",
};

const validUserWithoutPassword: UserWithoutPasswordType = {
  username: "ramy",
  email: "ramy@hotmail.com",
  avatar: "avatar.jpg",
};

describe("Register User Tests", () => {
  beforeEach(() => {
    validUserWithPassword.username = "ramy";
    validUserWithPassword.email = "ramy@hotmail.com";
    validUserWithPassword.password = "123456";
  });

  it("should register a user ", async () => {
    const user = new UserClass(validUserWithPassword);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    UserModel.prototype.save = jest.fn().mockReturnThis();
    const res = await user.registerUser(validUserWithPassword.password);
    expect(res).toMatchObject(validUserWithPassword);
  });

  it("should throws error if email exists ", async () => {
    const user = new UserClass(validUserWithPassword);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(true);
    try {
      await user.registerUser(validUserWithPassword.password);
    } catch (error) {
      expect(error.message).toEqual("Email already exists");
    }
  });

  it("should throws error if no email provided", async () => {
    validUserWithPassword.email = "";
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser(validUserWithPassword.password);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("email");
    }
  });

  it("should throws error if no username provided", async () => {
    validUserWithPassword.username = "";
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser(validUserWithPassword.password);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual("username");
    }
  });

  it("should throw four errors for required fields", async () => {
    const user = new UserClass({} as UserType);
    try {
      await user.registerUser("");
    } catch (error) {
      const errors: Joi.ValidationErrorItem[] = JSON.parse(error.message);
      expect(errors).toHaveLength(4);
    }
  });

  it("should throws error if empty password provided", async () => {
    validUserWithPassword.password = "";
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser("");
    } catch (error) {
      expect(JSON.parse(error.message)[0].message).toEqual(
        "password cannot be empty"
      );
    }
  });

  it("should throws error if empty password confirmation", async () => {
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser("");
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if wrong password confirmation", async () => {
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser("wrong password");
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });

  it("should throws error if null password confirmation", async () => {
    const user = new UserClass(validUserWithPassword);
    try {
      await user.registerUser((null as unknown) as string);
    } catch (error) {
      expect(JSON.parse(error.message)[0].context.key).toEqual(
        "repeat_password"
      );
    }
  });
});

describe("Login Users", () => {
  it("should Login User", async () => {
    const user = new UserClass(validUserWithPassword);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(user.getUser());
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(true);
    const res = await user.login();
    expect(res.token).toBeTruthy();
    expect(res.user).toMatchObject({
      username: user.getUser().username,
      email: user.getUser().email,
      avatar: user.getUser().avatar,
    });
    expect(res.user).not.toHaveProperty("password");
  });

  it("should Not Login User If Not Found", async () => {
    const user = new UserClass(validUserWithPassword);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(false);
    try {
      await user.login();
    } catch (error) {
      expect(error.message).toEqual("User Doesn't exist!!");
    }
  });

  it("should Not Login User If Wrong Password", async () => {
    const user = new UserClass(validUserWithPassword);
    UserValidation.getUserIfExists = jest.fn().mockReturnValue(user.getUser());
    UserValidation.comparePasswordWithHash = jest.fn().mockReturnValue(false);
    try {
      await user.login();
    } catch (error) {
      expect(error.message).toEqual("Wrong credentials!!");
    }
  });

  describe("UserValidation", () => {
    it("should return token with user ", () => {
      const res = AuthorizeUser.singUser(validUserWithoutPassword);
      expect(res.token).toBeTruthy();
      expect(res.user).toMatchObject(validUserWithoutPassword);
    });
  });
});
