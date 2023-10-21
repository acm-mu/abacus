import { NotFound } from 'components'
import { JudgeNavigation } from 'components/navigation'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Clarifications from '../Clarifications'
import Home from './Home'
import Problem from './Problem'
import Problems from './Problems'
import Submission from './Submission'
import Submissions from './Submissions'
import Teams from './Users'

const Judge = (): React.JSX.Element => (
  <>
    <JudgeNavigation />
    <Container text className="main">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="teams" element={<Teams />} />
        <Route path="problems/:pid" element={<Problem />} />
        <Route path="problems" element={<Problems />} />
        <Route path="submissions/:sid" element={<Submission />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="clarifications/:cid" element={<Clarifications />} />
        <Route path="clarifications" element={<Clarifications />} />
        <Route element={<NotFound />} />
      </Routes>
    </Container>
  </>
)

export default Judge
