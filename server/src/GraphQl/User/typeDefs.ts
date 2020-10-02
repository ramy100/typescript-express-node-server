import { gql } from "apollo-server";

export const UserTypeDefs = gql`
  type FriendRequest {
    from: User
    to: String
  }

  type FriendRequestResponse {
    code: Int
    success: Boolean
    data: FriendRequest
    message: String
  }

  type User {
    id: String
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
    sendFriendRequest(friendId: String): FriendRequestResponse
  }
`;
