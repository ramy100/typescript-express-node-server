import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import HomeNavBar from "../HomeNavBar/HomeNavBar";
import DynamicRoutes from "../Utils/DynamicRoutes";
import { useAuthDispatch } from "../../context/auth";
import { setContext } from "@apollo/client/link/context";
import jwt from "jsonwebtoken";

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem("token");

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${token}`,
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

const MainPage = () => {
  const dispatch = useAuthDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwt.decode(token);
        dispatch({ type: "LOGIN", payload: user });
      } catch (error) {
        console.log(error.message);
      }
    }
  }, []);
  return (
    <div className='h-100'>
      <ApolloProvider client={client}>
        <Router>
          <HomeNavBar />
          <Switch>
            <DynamicRoutes exact path='/' authenticated>
              <HomePage />
            </DynamicRoutes>
            <DynamicRoutes exact path='/login' guest>
              <Login />
            </DynamicRoutes>
            <DynamicRoutes exact path='/register' guest>
              <Register />
            </DynamicRoutes>
          </Switch>
        </Router>
      </ApolloProvider>
    </div>
  );
};

export default MainPage;
