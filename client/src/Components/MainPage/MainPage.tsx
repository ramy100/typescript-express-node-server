import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import {
  ApolloClient,
  gql,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const MainPage = () => {
  return (
    <div className='h-100'>
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <HomePage />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/register'>
              <Register />
            </Route>
          </Switch>
        </Router>
      </ApolloProvider>
    </div>
  );
};

export default MainPage;
