import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, Routes } from 'react-router-dom'
import { NotFound } from 'components'
import JudgeNavigation from './JudgeNavigation'
import Home from './Home'
import Teams from './Users'
import Problems from './Problems'
import Problem from './Problem'
import Submission from './Submission'
import Submissions from './Submissions'
import Clarifications from '../Clarifications'

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
