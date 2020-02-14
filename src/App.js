import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import home from './views/layout/index.js'

function login() {
  return <div>登录</div>;
}

function List() {
  return <div>主页</div>;
}

function NotMatch() {
  return <div>页面不见了</div>;
}

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/login" component={login}></Route>
          <Route path="/home" component={home}></Route>
          <Route path="/citylist" component={List} />
          <Route component={NotMatch} />
        </Switch>
      </Router>
    );
  }
}
