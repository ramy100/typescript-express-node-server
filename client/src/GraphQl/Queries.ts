import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query LoginUser($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
      user {
        username
        email
        avatar
      }
    }
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
