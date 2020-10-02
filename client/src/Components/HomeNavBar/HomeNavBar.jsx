import React, { Fragment } from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import "./HomeNavBar.scss";

const HomeNavBar = () => {
  const dispatch = useAuthDispatch();
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };
  const { user } = useAuthState();

  return (
    <div>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Brand as={Link} to='/'>
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
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
          <Nav className='nav-links'>
            {user ? (
              <Button onClick={logout} variant='danger'>
                Logout
              </Button>
            ) : (
              ""
            )}
            {!user ? (
              <Fragment>
                <Link className='text-light' to='/login'>
                  Login
                </Link>
                <Link className='text-light' to='/register'>
                  Register
                </Link>
              </Fragment>
            ) : (
              ""
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default HomeNavBar;
