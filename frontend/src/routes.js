import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import History from "./containers/History";

const BaseRouter = () => (
  <div>
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/history/:token/" component={History} />
  </div>
);

export default BaseRouter;