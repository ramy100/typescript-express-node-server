import gql from 'graphql-tag'
export const LOGIN_QUERY = gql`
  query loginUser($email: String, $password: String) {
    login(email: $email, password: $password) {
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
