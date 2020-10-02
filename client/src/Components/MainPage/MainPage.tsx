import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AuthProvider } from "../../context/auth";
import HomeNavBar from "../HomeNavBar/HomeNavBar";
import DynamicRoutes from "../Utils/DynamicRoutes";
const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const MainPage = () => {
  return (
    <div className='h-100'>
      <ApolloProvider client={client}>
        <AuthProvider>
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
        </AuthProvider>
      </ApolloProvider>
    </div>
  );
};

export default MainPage;
