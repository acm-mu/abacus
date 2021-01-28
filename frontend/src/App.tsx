import React from "react";

import { Index, Blue, Gold } from "./pages";
import { Footer } from "./components";
import "./App.scss";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = (): JSX.Element => (
  <>
    <Router>
      <Switch>
        <Route path="/blue" component={Blue} />
        <Route path="/gold" component={Gold} />
        <Route path="/" component={Index} />
      </Switch>
    </Router>
    <Footer />
  </>
);

export default App;
