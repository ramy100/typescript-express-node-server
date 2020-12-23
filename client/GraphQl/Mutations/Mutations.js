import gql from 'graphql-tag'
export const REGISTER = gql`
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
    }
  }
`

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($friendId: String) {
    sendFriendRequest(friendId: $friendId) {
      message
      code
      success
    }
  }
`

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
`
