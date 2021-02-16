import React from "react";
import { Switch, Route } from 'react-router-dom'
import { Container } from "semantic-ui-react";
import { NotFound } from '../../components'
import BlueNavigation from './BlueNavigation'
import Home from './Home'
import Problem from './Problem'
import Problems from './Problems'
import Standings from './Standings'
import Submissions from './Submissions'
import Submission from './Submission'
import Submit from './Submit'

const Blue = (): JSX.Element => (
  <>
    <BlueNavigation />
    <Container text className="main">
      <Switch>
        <Route exact path='/blue/' component={Home} />
        <Route path='/blue/problem/' component={Problem} />
        <Route path='/blue/problems/:problem_id/submit' component={Submit} />
        <Route path='/blue/problems/:problem_id' component={Problem} />
        <Route path='/blue/problems' component={Problems} />
        <Route path='/blue/standings' component={Standings} />
        <Route path='/blue/submissions/:submission_id' component={Submission} />
        <Route path='/blue/submissions' component={Submissions} />
        <Route default component={NotFound} />
      </Switch>
    </Container>
  </>
);

export default Blue;
