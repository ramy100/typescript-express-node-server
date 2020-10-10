import { gql } from "@apollo/client";

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
`;
