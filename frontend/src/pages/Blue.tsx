import React from "react";
import {Switch, Route} from 'react-router-dom'
import { Container } from "semantic-ui-react";
import { BlueNavigation } from "./blue/";
import { Home, Problem, Problems, Standings, Submissions, Submission } from './blue/'

const Blue = (): JSX.Element => (
  <>
    <BlueNavigation />
    <Container text className="main">
      <Switch>
        <Route exact path='/blue/' component={Home} />
        <Route path='/blue/problem/' component={Problem} />
        <Route path='/blue/problems' component={Problems} />
        <Route path='/blue/standings' component={Standings} />
        <Route path='/blue/submissions' component={Submissions} />
        <Route path='/blue/submission/' component={Submission} />
      </Switch>
    </Container>
  </>
);

export default Blue;
