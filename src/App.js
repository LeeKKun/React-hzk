import React, { Component, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

const home = React.lazy(() => import("./views/layout/index.js"));
const citylist = React.lazy(() => import("./views/city/index.js"));
const map = React.lazy(() => import("./views/map/index.js"));
const detail = React.lazy(() => import("./views/detail/index"));
const Login = React.lazy(() => import("./views/Login/index"));

function NotMatch() {
  return <div>页面不见了</div>;
}

export default class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route path="/login" component={Login}></Route>
            <Route path="/home" component={home}></Route>
            <Route path="/detail" component={detail}></Route>
            <Route path="/citylist" component={citylist} />
            <Route path="/map" component={map} />
            <Route component={NotMatch} />
          </Switch>
        </Suspense>
      </Router>
    );
  }
}
