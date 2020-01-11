import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UserReviews from "./containers/UserReviews";
import UserLikes from "./containers/UserLikes";
import UserGifts from "./containers/UserGifts";
import Homepage from "./containers/Homepage";
import ChangePreferences from "./containers/ChangePreferences"

const BaseRouter = () => (
  <div>
    <Route exact path='/' component={Homepage}/>
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/userreviews/:token/" component={UserReviews} />
    <Route exact path="/liked/:token/" component={UserLikes} />
    <Route exact path="/usergifts/:token/" component={UserGifts} />
    <Route exact path="/preferences/" component={ChangePreferences} />
  </div>
);

export default BaseRouter;