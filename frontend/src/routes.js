import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import DishPage from "./containers/DishPage";
import RestPage from "./containers/RestPage";

const BaseRouter = () => (
  <div>
    <Route exact path="/login/" component={Login} />{" "}
    <Route exact path="/signup/" component={Signup} />{" "}
    <Route exact path="/dish/:dishID" component={DishPage} />{" "}
    <Route exact path="/rest/:restID" component={RestPage} />{" "}
  </div>
);

export default BaseRouter;