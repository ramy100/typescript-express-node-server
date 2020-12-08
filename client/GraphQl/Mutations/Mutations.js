import gql from 'graphql-tag'
export const REGISTER_MUTATION = gql`
  mutation REGISTERUSER(
    $username: String
    $email: String
    $password: String
    $repeat_password: String
  ) {
    register(
      email: $email
      password: $password
      repeat_password: $repeat_password
      username: $username
    ) {
      code
      success
      message
      data {
        token
        user {
          username
          email
        }
      }
    }
  }
`
