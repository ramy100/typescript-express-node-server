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

export const LOGIN_FROM_TOKEN_QUERY = gql`
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
`

export const LOGOUT_USER_QUERY = gql`
  query LogoutUser {
    logout
  }
`

export const GET_USERS_QUERY = gql`
  query GetUsers($pageNum: Int!) {
    users(pageNum: $pageNum) {
      username
      id
      avatar
      email
    }
  }
`
export const READ_MESSAGES_QUERY = gql`
  query($friendId: String!, $pageNum: Int!) {
    readMessages(friendId: $friendId, pageNum: $pageNum) {
      to
      from
      content
      created_at
      id
    }
  }
`
