import React from 'react'
import { Route, Routes, Outlet } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { NotFound } from 'components'
import BlueNavigation from './BlueNavigation'
import Home from './Home'
import Problem from './Problem'
import Problems from './Problems'
import Standings from './Standings'
import Submissions from './Submissions'
import Submission from './Submission'
import Submit from './Submit'
import Clarifications from '../Clarifications'
import Practice from './practice'
import Rules from './Rules'

const Blue = (): React.JSX.Element => (
  <>
    <BlueNavigation />
    <Container text className="main">
      <Routes>
        <Route path="problems" element={<Outlet />}>
          <Route path=":pid/submit" element={<Submit />} />
          <Route path=":pid" element={<Problem />} />
          <Route path="" element={<Problems />} />
        </Route>
        <Route path="problem" element={<Problem />} />
        <Route path="standings" element={<Standings />} />
        <Route path="submissions/:sid" element={<Submission />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="clarifications/:cid" element={<Clarifications />} />
        <Route path="clarifications" element={<Clarifications />} />
        <Route path="practice" element={<Practice />} />
        <Route path="rules" element={<Rules />} />
        <Route path="" element={<Home />} />
        <Route element={<NotFound />} />
      </Routes>
    </Container>
  </>
)

export default Blue
