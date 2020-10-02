import React, { Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import "./Login.scss";

const Login = () => {
  return (
    <Fragment>
      <div className='mainWrapper'>
        <div className='login-form'>
          <h1 className='text-center'>Login</h1>
          <Form>
            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type='email' placeholder='Enter email' />
            </Form.Group>
            <Form.Group controlId='formGroupPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' />
            </Form.Group>
            <div className='submit-button'>
              <Button size='lg' variant='success' type='submit'>
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
