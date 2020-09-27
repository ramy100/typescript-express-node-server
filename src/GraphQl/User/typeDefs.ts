const { gql } = require("apollo-server");

export const UserTypeDefs = gql`
  type User {
    username: String
    email: String
    avatar: String
    friends: [User]
    friendRequests: [User]
    registered_at: String
    deactivated_at: String
  }

  type LoginToken {
    token: String
    user: User
  }
  extend type Query {
    users: [User]
    login(email: String, password: String): LoginToken
  }
  type Mutation {
    register(
      username: String
      email: String
      password: String
      repeat_password: String
    ): User
  }
`;
