import React from "react";
import { Container } from "semantic-ui-react";
import GoldNavigation from "./GoldNavigation";
import Home from "./Home";
import NotFound from "../NotFound";
import { Switch, Route } from "react-router-dom";

const Gold = (): JSX.Element => (
  <>
    <GoldNavigation />
    <Container text className="main">
      <Switch>
        <Route exact path='/gold/' component={Home} />
        <Route default component={NotFound} />
      </Switch>
    </Container>
  </>
);

export default Gold;
