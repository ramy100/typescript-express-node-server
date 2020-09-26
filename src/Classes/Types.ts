export type UserType = {
  username: string;
  email: string;
  password: string;
  avatar?: string;
};

export type UserWithoutPasswordType = {
  username: string;
  email: string;
  avatar?: string;
};
