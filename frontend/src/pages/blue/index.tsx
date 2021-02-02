import Problem from './Problem'
import Problems from './Problems'
import Standings from './Standings'
import Submissions from './Submissions'
import Submission from './Submission'
import Home from './Home'
import BlueNavigation from './BlueNavigation'

import React from "react";
import {Switch, Route} from 'react-router-dom'
import { Container } from "semantic-ui-react";
import NotFound from '../NotFound'

/* Flask endpoints to move to backend
  * /problems/<pid>/submit
*/

const Blue = (): JSX.Element => (
  <>
    <BlueNavigation />
    <Container text className="main">
      <Switch>
        <Route exact path='/blue/' component={Home} />
        <Route path='/blue/problem/' component={Problem} />
        <Route path='/blue/problems' component={Problems} />
        <Route path='/blue/problems/:problem_id' component={Problem} />
        <Route path='/blue/standings' component={Standings} />
        <Route path='/blue/submissions' component={Submissions} />
        <Route path='/blue/submissions/:submission_id' component={Submission} />
        <Route default component={NotFound} />
      </Switch>
    </Container>
  </>
);

export default Blue;