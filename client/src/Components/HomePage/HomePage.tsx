import { useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useUsersDispatch } from "../../context/users";
import { FRIEND_REQUEST_SUPSRIBTION } from "../../GraphQl/Subscriptions";

const HomePage = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const usersDispatch = useUsersDispatch();

  const { data: newFriendRequest } = useSubscription(
    FRIEND_REQUEST_SUPSRIBTION
  );

  useEffect(() => {
    if (newFriendRequest?.friendRequestRecieved?.from) {
      authDispatch({
        type: "ADD_FRIEND_REQUESTS",
        payload: newFriendRequest?.friendRequestRecieved.from,
      });
      usersDispatch({
        type: "REMOVE_FROM_NOT_ADDED_USERS",
        payload: newFriendRequest?.friendRequestRecieved.from.id,
      });
    }
  }, [newFriendRequest?.friendRequestRecieved]);

  return (
    <div>
      <h1>{user?.friends.map((friend: any) => friend.email)}</h1>
    </div>
  );
};

export default HomePage;
