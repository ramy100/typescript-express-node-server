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
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  friends?: string[];
  friendRequests?: string[];
  registered_at?: Date;
  deactivated_at?: Date;
};
