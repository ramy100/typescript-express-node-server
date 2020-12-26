import gql from 'graphql-tag'

export const FRIEND_REQUEST_SUPSRIBTION = gql`
  subscription OnFriendRequestRecieved {
    friendRequestRecieved {
      to
      from {
        id
        username
        email
        avatar
      }
    }
  }
`

export const CHAT_MESSAGE_SUPSRIBTION = gql`
  subscription {
    chatMessages {
      id
      from {
        id
        username
        email
        avatar
      }
      content
    }
  }
`
