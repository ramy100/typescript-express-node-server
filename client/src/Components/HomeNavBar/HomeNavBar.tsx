import React, { Fragment, useEffect, useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faBell } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import "./HomeNavBar.scss";
import { User } from "../../Classes/User";
import { GET_USER_FROM_TOKEN, LOGOUT_USER } from "../../GraphQl/Queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useUsersDispatch } from "../../context/users";

const HomeNavBar = () => {
  const Authdispatch = useAuthDispatch();
  const { user } = useAuthState();
  const usersModaldispatch = useUsersDispatch();

  const history = useHistory();

  const { data, loading } = useQuery(GET_USER_FROM_TOKEN, {
    onCompleted: (data) => {
      Authdispatch({ type: "LOGIN", payload: data.user });
    },
  });

  const [LogOUTUserGql, { loading: loadingLogout }] = useLazyQuery(
    LOGOUT_USER,
    {
      onCompleted: (res) => {
        usersModaldispatch({ type: "CLOSE_MODAL" });
        User.logOut(Authdispatch, usersModaldispatch, history);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        {user?.username ? `Welcome ${user?.username}` : "Home"}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {/* <Nav.Link href='#features'>Features</Nav.Link> */}
          {/* <Nav.Link href='#pricing'>Pricing</Nav.Link> */}
          {/* <NavDropdown title='Dropdown' id='collasible-nav-dropdown'> */}
          {/* <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='#action/3.4'>
                Separated link
              </NavDropdown.Item> */}
          {/* </NavDropdown> */}
        </Nav>
        <Nav className="nav-links">
          {user ? (
            <Fragment>
              <Button variant="dark" className="with-notification">
                <FontAwesomeIcon icon={faBell} />
                <div className="notifications">1</div>
              </Button>
              <Button
                onClick={() => usersModaldispatch({ type: "TOGGLE_MODAL" })}
                variant="dark"
                className="with-notification"
              >
                <FontAwesomeIcon icon={faUserFriends} />
                {user?.friendRequests?.length ? (
                  <div className="notifications">
                    {user?.friendRequests?.length}
                  </div>
                ) : (
                  ""
                )}
              </Button>
              <Button onClick={() => LogOUTUserGql()} variant="danger">
                Logout
              </Button>
            </Fragment>
          ) : (
            ""
          )}
          {!user ? (
            <Fragment>
              <Link className="text-light" to="/login">
                Login
              </Link>
              <Link className="text-light" to="/register">
                Register
              </Link>
            </Fragment>
          ) : (
            ""
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HomeNavBar;
