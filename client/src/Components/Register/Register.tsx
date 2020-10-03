import { useMutation } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { User } from "../../Classes/User";
import { useAuthDispatch } from "../../context/auth";
import { REGISTER_USER } from "../../GraphQl/Mutations";
import FormTextField from "../FormTextField/FormTextField";
import "./Register.scss";

const Register = () => {
  const InitialFormErrors: {
    email?: string;
    password?: string;
    repeat_password?: string;
    username?: string;
  } = {};
  const dispatch = useAuthDispatch();
  const history = useHistory();

  const [formErrors, setFormErrors] = useState(InitialFormErrors);
  const [formData, setFormData] = useState({});

  const [RegisterUserGql, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: ({ register: { token, user } }: any) => {
      User.loginUser(token, dispatch, user, history);
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
        setFormErrors(InitialFormErrors);
        console.log(gqlError.message);
      }
    },
  });

  const registerUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    RegisterUserGql({ variables: formData });
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
              error={formErrors?.username}
            />
            <FormTextField
              label='Email Address'
              fieldName='email'
              inputChange={inputChange}
              placeholder='Enter Email Adress'
              error={formErrors?.email}
            />
            <FormTextField
              label='Password'
              fieldName='password'
              inputChange={inputChange}
              placeholder='Password'
              type='password'
              error={formErrors?.password}
            />
            <FormTextField
              label='Password Confrimation'
              fieldName='repeat_password'
              inputChange={inputChange}
              placeholder='Password confrimation'
              type='password'
              error={formErrors?.repeat_password}
            />
            <div className='submit-button'>
              <Button variant='success' type='submit'>
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
