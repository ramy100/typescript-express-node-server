import React from "react";
import { Button } from "react-bootstrap";
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
  return (
    <div className="user" ref={is_last ? lastElCallback : undefined}>
      <div className="avatar"></div>
      <div>
        <h5 className="username">{user.username}</h5>
      </div>
      <div className="buttons">
        <Button variant="outline-dark" size="sm">
          Add friend
        </Button>
      </div>
    </div>
  );
};

export default User;
