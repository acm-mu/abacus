import { NotFound, Unauthorized } from 'components'
import { LoginModal } from 'components/modal'
import { AppContext } from 'context'
import DefaultNavigation from 'pages/DefaultNavigation'
import React, { useContext } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import AdminNavigation from './AdminNavigation'
import ClarificationPage from './Clarification'
import Clarifications from './Clarifications'

import Home from './Home'
import EditProblem from './problems/EditProblem'
import NewProblem from './problems/NewProblem'
import Problems from './problems/Problems'
import UploadProblems from './problems/UploadProblems'
import Settings from './Settings'
import Submission from './submissions/Submission'
import Submissions from './submissions/Submissions'
import EditUser from './users/EditUser'
import UploadUsers from './users/UploadUsers'
import Users from './users/Users'

const Admin = (): React.JSX.Element => {
  const { user } = useContext(AppContext)

  if (!user)
    return (
      <>
        <DefaultNavigation />
        <Container text className="main">
          <LoginModal open={true} />
          <Unauthorized />
        </Container>
      </>
    )

  return (
    <>
      <AdminNavigation />
      <Container text className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="problems" element={<Outlet />}>
            <Route path="new" element={<NewProblem />} />
            <Route path="upload" element={<UploadProblems />} />
            <Route path=":pid" element={<EditProblem />} />
            <Route path="" element={<Problems />} />
          </Route>
          <Route path="users" element={<Outlet />}>
            <Route path="upload" element={<UploadUsers />} />
            <Route path=":uid" element={<EditUser />} />
            <Route path="" element={<Users />} />
          </Route>
          <Route path="submissions" element={<Outlet />}>
            <Route path=":sid" element={<Submission />} />
            <Route path="" element={<Submissions />} />
          </Route>
          <Route path="clarifications" element={<Outlet />}>
            <Route path=":cid" element={<ClarificationPage />} />
            <Route path="" element={<Clarifications />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  )
}

export default Admin
