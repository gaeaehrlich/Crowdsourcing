import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UserReviews from "./containers/UserReviews";
import UserLikes from "./containers/UserLikes";
import UserGifts from "./containers/UserGifts";

const BaseRouter = () => (
  <div>
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/userreviews/:token/" component={UserReviews} />
    <Route exact path="/liked/:token/" component={UserLikes} />
    <Route exact path="/usergifts/:token/" component={UserGifts} />
  </div>
);

export default BaseRouter;