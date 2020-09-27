export type UserLoginType = {
  email: string;
  password: string;
};

export type UserRegisterType = UserLoginType & {
  username: string;
  repeat_password: string;
  avatar?: string;
};

export type UserType = {
  username: string;
  email: string;
  avatar?: string;
  friends: string[];
  friendRequests: string[];
};
