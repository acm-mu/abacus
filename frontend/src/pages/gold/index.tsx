import React from "react";
import { Container } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "components";
import GoldNavigation from "./GoldNavigation";
import Home from "./Home";
import Connect from "./Connect";
import Problems from './Problems'
import Submit from './Submit'
import Problem from "./Problem";
import Submission from "./Submission";
import Submissions from "./Submissions";
import Standings from "./Standings";
import Clarifications from "../Clarifications";

const Gold = (): JSX.Element => (
  <>
    <GoldNavigation />
    <Container text className="main">
      <Connect />
      <Switch>
        <Route exact path='/gold/' component={Home} />
        <Route path='/gold/connect' component={Connect} />
        <Route path='/gold/submit' component={Submit} />
        <Route path='/gold/problems/:pid/submit' component={Submit} />
        <Route path='/gold/problems/:pid' component={Problem} />
        <Route path='/gold/problems' component={Problems} />
        <Route path='/gold/submissions/:sid' component={Submission} />
        <Route path='/gold/submissions' component={Submissions} />
        <Route path='/gold/standings' component={Standings} />
        <Route path='/gold/clarifications' component={Clarifications} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  </>
);

export default Gold;
