import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation registerUser(
    $email: String
    $password: String
    $repeat_password: String
    $username: String
  ) {
    register(
      email: $email
      password: $password
      repeat_password: $repeat_password
      username: $username
    ) {
      token
      user {
        username
        email
        avatar
      }
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($friendId: String) {
    sendFriendRequest(friendId: $friendId) {
      message
      code
      success
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($friendId: String) {
    acceptFriendRequest(friendId: $friendId) {
      message
      code
      success
      data {
        id
        email
        username
        avatar
      }
    }
  }
`;
