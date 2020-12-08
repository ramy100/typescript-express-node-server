import { gql } from "apollo-server";

export const UserTypeDefs = gql`
  type FriendRequest {
    from: User
    to: String
  }

  type loginToken {
    token: String
    user: User
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

  type LoginResponse implements IResponse {
    code: Int
    success: Boolean
    message: String
    data: loginToken
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

  extend type Query {
    users(pageNum: Int): [User]
    user: User
    login(email: String, password: String): LoginResponse
    logout: Boolean
    getAll: [User]
  }
  extend type Mutation {
    register(
      username: String
      email: String
      password: String
      repeat_password: String
    ): LoginResponse
    deleteAll: Boolean
    del: Boolean
    sendFriendRequest(friendId: String): FriendRequestResponse
    acceptFriendRequest(friendId: String): AcceptFriendRequestResponse
  }
`;
