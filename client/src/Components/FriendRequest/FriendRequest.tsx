import { useMutation } from "@apollo/client";
import React from "react";
import { Button } from "react-bootstrap";
import { useAuthDispatch } from "../../context/auth";
import { ACCEPT_FRIEND_REQUEST } from "../../GraphQl/Mutations";

const FriendRequest = ({
  user,
}: {
  user: { id: string; email: string; avatar: string; username: string };
}) => {
  const authDispatch = useAuthDispatch();
  const [accpetFriendReuqestGql, { loading }] = useMutation(
    ACCEPT_FRIEND_REQUEST,
    {
      onCompleted: ({
        acceptFriendRequest: { message, code, success, data },
      }) => {
        const { id, email, username, avatar } = data;
        if (code === 200) {
          authDispatch({
            type: "REMOVE_FRIEND_REQUEST",
            payload: id,
          });
          authDispatch({
            type: "ADD_FRIEND",
            payload: { id, email, username, avatar },
          });
        }
        console.log("code :>> ", code);
        console.log("message :>> ", message);
        console.log("success :>> ", success);
        console.log("acceptFriendRequest :>> ", data);
      },
      onError: (gqlError) => {
        console.log(gqlError.message);
      },
      variables: { friendId: user.id },
    }
  );
  return (
    <div className="user">
      <div className="avatar"></div>
      <div>
        <h5 className="username">{user.email}</h5>
      </div>
      <div className="buttons">
        <Button size="sm" onClick={() => accpetFriendReuqestGql()}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default FriendRequest;
