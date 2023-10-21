import { NotFound } from 'components'
import { GoldNavigation } from 'components/navigation'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Clarifications from '../Clarifications'
import Home from './Home'
import Problem from './Problem'
import Problems from './Problems'
import Rules from './Rules'
import Standings from './Standings'
import Submission from './Submission'
import Submissions from './Submissions'
import Submit from './Submit'

const Gold = (): React.JSX.Element => (
  <>
    <GoldNavigation />
    <Container text className="main">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="submit/:project_id" element={<Submit />} />
        <Route path="problems" element={<Outlet />}>
          <Route path=":pid/submit" element={<Submit />} />
          <Route path=":pid" element={<Problem />} />
          <Route path="" element={<Problems />} />
        </Route>
        <Route path="submissions/:sid" element={<Submission />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="standings" element={<Standings />} />
        <Route path="clarifications/:cid" element={<Clarifications />} />
        <Route path="clarifications" element={<Clarifications />} />
        <Route path="rules" element={<Rules />} />
        <Route element={<NotFound />} />
      </Routes>
    </Container>
  </>
)

export default Gold
