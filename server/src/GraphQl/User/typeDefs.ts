import { gql } from "apollo-server";

export const UserTypeDefs = gql`
  type FriendRequest {
    from: User
    to: String
  }

  interface IResponse {
    code: Int
    success: Boolean
    message: String
  }

  type Response implements IResponse {
    code: Int
    success: Boolean
    message: String
    data: String
  }

  type FriendRequestResponse implements IResponse {
    code: Int
    success: Boolean
    message: String
    data: FriendRequest
  }

  type AcceptFriendRequestResponse implements IResponse {
    code: Int
    success: Boolean
    message: String
    data: User
  }

  type User {
    id: String
    username: String
    email: String
    avatar: String
    friends: [User]
    friendRequests: [User]
    registered_at: DateTime
    deactivated_at: DateTime
  }

  type LoginToken {
    token: String
    user: User
  }

  extend type Query {
    users(pageNum: Int): [User]
    user: User
    login(email: String, password: String): LoginToken
    logout: Boolean
    getAll: [User]
  }
  extend type Mutation {
    register(
      username: String
      email: String
      password: String
      repeat_password: String
    ): LoginToken
    deleteAll: Boolean
    del: Boolean
    sendFriendRequest(friendId: String): FriendRequestResponse
    acceptFriendRequest(friendId: String): AcceptFriendRequestResponse
  }
`;
