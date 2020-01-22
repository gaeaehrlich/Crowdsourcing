import React from "react";
import { Route } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UserReviews from "./containers/UserReviews";
import UserLikes from "./containers/UserLikes";
import UserGifts from "./containers/UserGifts";
import ChangePreferences from "./containers/ChangePreferences"
import DishPage from "./containers/DishPage";
import RestPage from "./containers/RestPage";
import MainPage from "./containers/MainPage"
import EatwithPage from "./containers/EatwithPage"
import SearchPage from "./containers/SearchPage";

const BaseRouter = () => (
  <div>
    <Route exact path="/" component={MainPage} />
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/userreviews/:token/" component={UserReviews} />
    <Route exact path="/liked/:token/" component={UserLikes} />
    <Route exact path="/usergifts/:token/" component={UserGifts} />
    <Route exact path="/preferences/" component={ChangePreferences} />
    <Route exact path="/dish/:dishID" component={DishPage} />
    <Route exact path="/rest/:restID" component={RestPage} />
    <Route exact path="/eatwith" component={EatwithPage} />
    <Route exact path="/search" component={SearchPage} />

  </div>
);

export default BaseRouter;