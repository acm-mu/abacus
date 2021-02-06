

import React from "react";
import { Switch, Route } from 'react-router-dom'
import { Container } from "semantic-ui-react";

import Home from './Home'
import Problems from './Problems'
import Users from './Users'
import AdminNavigation from './AdminNavigation'
import Submissions from './Submissions'
import Submission from './Submission'
import EditProblem from './EditProblem'
import NewProblem from './NewProblem'
import Settings from './Settings'
import NotFound from "../NotFound";
import { hasRole } from "../../authlib";
import { Unauthorized } from "../../components";
import DefaultNavigation from "../DefaultNavigation";

/* Flask Endpoints to be moved to backend
  * /submissions/<sid>/invoke
*/

const Admin = (): JSX.Element => (
  <>
    {!hasRole('admin') ?
      <>
        <DefaultNavigation />
        <Container text className="main">
          <Unauthorized />
        </Container>
      </> : <>
        <AdminNavigation />
        <Container text className="main">
          <Switch>
            <Route exact path='/admin/' component={Home} />
            <Route path='/admin/settings' component={Settings} />
            <Route path='/admin/problems/:problem_id/edit' component={EditProblem} />
            <Route path='/admin/problems/new' component={NewProblem} />
            <Route path='/admin/problems' component={Problems} />
            <Route path='/admin/users' component={Users} />
            <Route path='/admin/submissions' component={Submissions} />
            <Route path='/admin/submissions/:submission_id' component={Submission} />
            <Route default component={NotFound} />
          </Switch>
        </Container>
      </>
    }
  </>
);

export default Admin;
