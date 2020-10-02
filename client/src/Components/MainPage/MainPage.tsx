import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";

const MainPage = () => {
  return (
    <div className='h-100'>
      <Router>
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default MainPage;
