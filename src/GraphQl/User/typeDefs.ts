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

  extend type Query {
    users: [User]
    login(email: String, password: String): String
  }
  type Mutation {
    register(
      username: String
      email: String
      password: String
      repeat_password: String
    ): User
    deleteAll: Boolean
    sendFriendRequest(firendId: String): String
  }
`;
