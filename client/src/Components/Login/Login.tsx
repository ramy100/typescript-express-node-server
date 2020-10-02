import React, { Fragment, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import FormTextField from "../FormTextField/FormTextField";
import { Link, useHistory } from "react-router-dom";
import "./Login.scss";
import { gql, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../../context/auth";

const Login = () => {
  const LOGIN_USER = gql`
    query LoginUser($email: String, $password: String) {
      login(email: $email, password: $password) {
        token
        user {
          username
          email
          avatar
        }
      }
    }
  `;
  const history = useHistory();
  const dispatch = useAuthDispatch();
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({});

  const [LoginUserGql, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted: ({ login: { user, token } }) => {
      localStorage.setItem("token", token);
      console.log(user);
      dispatch({ type: "LOGIN", payload: user });
      history.push("/");
    },
    onError: (gqlError) => {
      try {
        const JoiErrors = JSON.parse(gqlError.message);
        const JoiErrorsObj: any = {};
        JoiErrors.forEach(
          (error: { context: { label: string }; message: string }) => {
            JoiErrorsObj[error.context.label] = error.message;
          }
        );
        setFormErrors(JoiErrorsObj);
      } catch (err) {
        setFormErrors({ email: "", password: "" });
        console.log(gqlError.message);
      }
    },
  });

  function LoginUser(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    LoginUserGql({ variables: formData });
  }
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className='mainWrapper'>
        <div className='login-form'>
          <h1 className='text-center'>Login</h1>
          <Form onSubmit={LoginUser}>
            <FormTextField
              label='Email Address'
              fieldName='email'
              inputChange={inputChange}
              placeholder='Enter Email'
              error={formErrors.email}
            />
            <FormTextField
              label='Password'
              fieldName='password'
              inputChange={inputChange}
              placeholder='Password'
              type='password'
              error={formErrors.password}
            />
            <div className='submit-button'>
              <Button disabled={loading} variant='success' type='submit'>
                {loading ? <Spinner animation='border' /> : "Login"}
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
