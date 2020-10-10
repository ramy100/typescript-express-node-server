import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { ApolloProvider, useQuery } from "@apollo/client";
import HomeNavBar from "../HomeNavBar/HomeNavBar";
import DynamicRoutes from "../Utils/DynamicRoutes";
import { client } from "../../GraphQl/Client";
import Modal from "../Modal/Modal";
import { useUsersState } from "../../context/users";
import Users from "../Users/Users";

const MainPage = () => {
  const { showModal } = useUsersState();
  return (
    // <div className="h-100">
    <ApolloProvider client={client}>
      <Router>
        <HomeNavBar />
        {showModal && (
          <Modal>
            <Users />
          </Modal>
        )}
        <Switch>
          <DynamicRoutes exact path="/" authenticated>
            <HomePage />
          </DynamicRoutes>
          <DynamicRoutes exact path="/login" guest>
            <Login />
          </DynamicRoutes>
          <DynamicRoutes exact path="/register" guest>
            <Register />
          </DynamicRoutes>
        </Switch>
      </Router>
    </ApolloProvider>
    // </div>
  );
};

export default MainPage;
