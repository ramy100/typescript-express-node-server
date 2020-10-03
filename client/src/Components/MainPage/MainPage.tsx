import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { ApolloProvider, useQuery } from "@apollo/client";
import HomeNavBar from "../HomeNavBar/HomeNavBar";
import DynamicRoutes from "../Utils/DynamicRoutes";
import { client } from "../../GraphQl/Client";

const MainPage = () => {
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
