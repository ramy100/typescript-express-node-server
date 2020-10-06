import { useMutation } from "@apollo/client";
import React from "react";
import { Button } from "react-bootstrap";
import { useUsersDispatch } from "../../context/users";
import { SEND_FRIEND_REQUEST } from "../../GraphQl/Mutations";
import "./User.scss";

const User = ({
  user,
  lastElCallback,
  is_last,
}: {
  user: { username: string; email: string; avatar: string; id: string };
  lastElCallback: any;
  is_last: boolean;
}) => {
  const usersDispatch = useUsersDispatch();
  const [sendFriendReuqestGql, { loading }] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted: ({ sendFriendRequest: { message, code, success, data } }) => {
      if (code === 200) {
        usersDispatch({
          type: "REMOVE_FROM_NOT_ADDED_USERS",
          payload: user.id,
        });
      }
      console.log("code :>> ", code);
      console.log("message :>> ", message);
      console.log("success :>> ", success);
      console.log("data :>> ", data);
    },
    onError: (gqlError) => {
      console.log(gqlError.message);
    },
    variables: { friendId: user.id },
  });

  return (
    <div className="user" ref={is_last ? lastElCallback : undefined}>
      <div className="avatar"></div>
      <div>
        <h5 className="username">{user.email}</h5>
      </div>
      <div className="buttons">
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => sendFriendReuqestGql()}
        >
          Add friend
        </Button>
      </div>
    </div>
  );
};

export default User;
