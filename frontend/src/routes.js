import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import DishPage from "./containers/DishPage";

const BaseRouter = () => (
  <div>
    <Route exact path="/login/" component={Login} />{" "}
    <Route exact path="/signup/" component={Signup} />{" "}
    <Route exact path="/dish/2" component={DishPage} />{" "}
  </div>
);

export default BaseRouter;