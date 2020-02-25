import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import home from './views/layout/index.js'

import citylist from './views/city/index.js'

import map from "./views/map/index.js";

import detail from "./views/detail/index";

import Login from "./views/Login/index";



function NotMatch() {
  return <div>页面不见了</div>;
}

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={home}></Route>
          <Route path="/detail" component={detail}></Route>
          <Route path="/citylist" component={citylist} />
          <Route path="/map" component={map} />
          <Route component={NotMatch} />
        </Switch>
      </Router>
    );
  }
}
