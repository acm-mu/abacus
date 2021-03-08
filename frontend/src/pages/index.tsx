import React from "react";

import Home from "./Home";
import About from "./About";
import Help from "./Help";
import DefaultNavigation from "./DefaultNavigation";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import { NotFound } from "../components";

const Index = (): JSX.Element => (
  <>
    <DefaultNavigation />

    <Container text className="main">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/help" component={Help} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  </>
);

export default Index
