import React, { Fragment, useState } from "react";
import { Button, Form } from "react-bootstrap";
import FormTextField from "../FormTextField/FormTextField";
import { Link } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [formData, setFormData] = useState({});
  const LogUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <div className='mainWrapper'>
        <div className='login-form'>
          <h1 className='text-center'>Login</h1>
          <Form onSubmit={LogUser}>
            <FormTextField
              label='Email Address'
              fieldName='email'
              inputChange={inputChange}
              placeholder='Enter Email'
            />
            <FormTextField
              label='Password'
              fieldName='password'
              inputChange={inputChange}
              placeholder='Password'
              type='password'
            />
            <div className='submit-button'>
              <Button size='lg' variant='success' type='submit'>
                Login
              </Button>
              <Link to='/register'>Dont have an account ? create one</Link>
            </div>
          </Form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;