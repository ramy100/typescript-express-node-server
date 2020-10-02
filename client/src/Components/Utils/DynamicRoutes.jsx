import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuthState } from "../../context/auth";

const DynamicRoutes = (props) => {
  const { user } = useAuthState();
  if (props.authenticated && !user) return <Redirect to='/login' />;
  if (props.guest && user) return <Redirect to='/' />;

  return <Route component={props.component} {...props} />;
};

export default DynamicRoutes;
