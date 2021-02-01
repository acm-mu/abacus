import React from "react";

import { Footer } from "./components";
import "./App.scss";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Admin from "./pages/admin/";
import Blue from './pages/blue/';
import Gold from './pages/gold/'
import Index from './pages'

const App = (): JSX.Element => (
  <>
    <Router>
      <Switch>
        <Route path='/admin' component={Admin} />
        <Route path="/blue" component={Blue} />
        <Route path="/gold" component={Gold} />
        <Route path="/" component={Index} />
      </Switch>
    </Router>
    <Footer />
  </>
);

export default App;
