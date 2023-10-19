import React from 'react'
import { Container } from 'semantic-ui-react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { NotFound } from 'components'
import GoldNavigation from './GoldNavigation'
import Home from './Home'
import Rules from './Rules'
import Problems from './Problems'
import Submit from './Submit'
import Problem from './Problem'
import Submission from './Submission'
import Submissions from './Submissions'
import Standings from './Standings'
import Clarifications from '../Clarifications'

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
