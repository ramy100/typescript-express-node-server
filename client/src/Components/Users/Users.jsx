import React, { useCallback, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useAuthState } from "../../context/auth";
import { useUsersDispatch, useUsersState } from "../../context/users";
import useGetUsers from "../../Hooks/useGetUsers";
import FriendRequest from "../FriendRequest/FriendRequest";
import User from "../User/User";
import "./Users.scss";
const Users = () => {
  const { users, pageNum, hasMoreToFetch } = useUsersState();
  const { user } = useAuthState();
  const usersDispatch = useUsersDispatch();
  const { loading } = useGetUsers(pageNum);

  const observer = useRef();
  const lastElCallback = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreToFetch) {
          usersDispatch({ type: "INCREMENT_PAGE_NUM" });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMoreToFetch]
  );

  return (
    <div className="users-list">
      {user?.friendRequests.map((friendReq) => (
        <FriendRequest key={user.id} user={friendReq} />
      ))}
      <hr className="solid" />
      {users?.map((user, index) => (
        <User
          lastElCallback={lastElCallback}
          is_last={users.length === index + 1}
          key={user.id}
          user={user}
        />
      ))}
      {loading && (
        <div className="spinner">
          <Spinner className="spin" animation="border" />
          <h5>Loading Users</h5>
        </div>
      )}
    </div>
  );
};

export default Users;
