import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query LoginUser($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        friendRequests {
          email
        }
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  query LogoutUser {
    logout
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      username
      id
      avatar
      email
    }
  }
`;

export const GET_USER_FROM_TOKEN = gql`
  query GetUserFromToken {
    user {
      id
      username
      email
      avatar
      friendRequests {
        id
        email
        username
        avatar
      }
      friends {
        id
        email
        username
        avatar
      }
    }
  }
`;
