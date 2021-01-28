import React from "react";

import Home from "./Home";
import About from "./About";
import Login from "./Login";
import Help from "./Help";
import NotFound from "./NotFound";
import DefaultNavigation from "./DefaultNavigation";
import { Container } from "semantic-ui-react";

import { Route, Switch } from "react-router-dom";

const Index = (): JSX.Element => (
  <>
    <DefaultNavigation />

    <Container text className="main">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/help" component={Help} />
        <Route default component={NotFound} />
      </Switch>
    </Container>
  </>
);

export { Index };
export { default as Blue } from "./Blue";
export { default as Gold } from "./Gold";
