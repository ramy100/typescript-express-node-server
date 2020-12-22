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

export const SEND_FRIEND_REQUEST_MUTATION = gql`
  mutation sendFriendRequest($friendId: String) {
    sendFriendRequest(friendId: $friendId) {
      message
      code
      success
    }
  }
`

export const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
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
`
