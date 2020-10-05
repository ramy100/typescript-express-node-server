import { useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { FRIEND_REQUEST_SUPSRIBTION } from "../../GraphQl/Subscriptions";

const HomePage = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const {
    data: newFriendRequest,
    loading: friendRequestLoading,
  } = useSubscription(FRIEND_REQUEST_SUPSRIBTION);

  useEffect(() => {
    if (newFriendRequest?.friendRequestRecieved?.from) {
      dispatch({
        type: "ADD_FRIEND_REQUESTS",
        payload: newFriendRequest?.friendRequestRecieved.from,
      });
    }
  }, [newFriendRequest?.friendRequestRecieved]);

  return (
    <div>
      <h1>{user.email}</h1>
    </div>
  );
};

export default HomePage;
