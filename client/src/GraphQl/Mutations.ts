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
