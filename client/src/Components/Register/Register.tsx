import React, { Fragment, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormTextField from "../FormTextField/FormTextField";

const Register = () => {
  const [formData, setFormData] = useState({});
  const registerUser = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h1 className='text-center'>Register</h1>
          <Form onSubmit={registerUser}>
            <FormTextField
              label='User Name'
              fieldName='username'
              inputChange={inputChange}
              placeholder='Enter User Name'
            />
            <FormTextField
              label='Email Address'
              fieldName='email'
              inputChange={inputChange}
              placeholder='Enter Email Adress'
            />
            <FormTextField
              label='Password'
              fieldName='password'
              inputChange={inputChange}
              placeholder='Password'
              type='password'
            />
            <FormTextField
              label='Password Confrimation'
              fieldName='repeat_password'
              inputChange={inputChange}
              placeholder='Password confrimation'
              type='password'
            />
            <div className='submit-button'>
              <Button size='lg' variant='success' type='submit'>
                Register
              </Button>
              <Link to='/login'>Already have an account ? Log in</Link>
            </div>
          </Form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
