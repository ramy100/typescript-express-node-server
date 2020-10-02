import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useAuthState } from "../../context/auth";

const GET_USERS = gql`
  query GetUsers {
    users {
      username
      id
      avatar
      email
    }
  }
`;

const FRIEND_REQUEST_SUPSRIBTION = gql`
  subscription OnFriendRequestRecieved {
    friendRequestRecieved {
      to
      from {
        username
        email
        avatar
      }
    }
  }
`;

const HomePage = () => {
  const { user } = useAuthState();
  const { loading, error, data } = useQuery(GET_USERS, {
    onError: (error) => {
      console.log(error.message);
    },
    onCompleted: (data) => {
      console.log(data.users);
    },
  });

  const {
    data: newFriendRequest,
    loading: friendRequestLoading,
  } = useSubscription(FRIEND_REQUEST_SUPSRIBTION);

  useEffect(() => {
    console.log(newFriendRequest?.friendRequestRecieved.from);
  }, [newFriendRequest?.friendRequestRecieved]);

  return (
    <div>
      <h1>{user.email}</h1>
    </div>
  );
};

export default HomePage;
