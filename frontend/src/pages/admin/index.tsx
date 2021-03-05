

import React, { useContext } from "react";
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
import { NotFound, Unauthorized } from "../../components";
import EditUser from "./EditUser";
import UploadUsers from "./UploadUsers";
import UploadProblems from "./UploadProblems";
import LoginModal from "../../components/Login";
import AppContext from "../../AppContext";
import DefaultNavigation from "../DefaultNavigation";

const Admin = (): JSX.Element => {
  const { user } = useContext(AppContext)

  if (!user) return (<>
    <DefaultNavigation />
    <Container text className='main'>
      <LoginModal open={true} />
      <Unauthorized />
    </Container>
  </>)

  return (
    <>
      <AdminNavigation />
      <Container text className="main">
        <Switch>
          <Route exact path='/admin/' component={Home} />
          <Route path='/admin/settings' component={Settings} />
          <Route path='/admin/problems/new' component={NewProblem} />
          <Route path='/admin/problems/upload' component={UploadProblems} />
          <Route path='/admin/problems/:pid' component={EditProblem} />
          <Route path='/admin/problems' component={Problems} />
          <Route path='/admin/users/upload' component={UploadUsers} />
          <Route path='/admin/users/:uid' component={EditUser} />
          <Route path='/admin/users' component={Users} />
          <Route path='/admin/submissions/:sid' component={Submission} />
          <Route path='/admin/submissions' component={Submissions} />
          <Route default component={NotFound} />
        </Switch>
      </Container>
    </>
  )
}

export default Admin;
