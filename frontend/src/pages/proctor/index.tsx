import { NotFound } from 'components'
import { ProctorNavigation } from 'components/navigation'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Home from './Home'
import Problem from './Problem'
import Problems from './Problems'
import Submission from './Submission'
import Submissions from './Submissions'

const Proctor = (): React.JSX.Element => (
  <>
    <ProctorNavigation />
    <Container text className="main">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="problems/:pid" element={<Problem />} />
        <Route path="problems" element={<Problems />} />
        <Route path="submissions/:sid" element={<Submission />} />
        <Route path="submissions" element={<Submissions />} />
        <Route element={<NotFound />} />
      </Routes>
    </Container>
  </>
)

export default Proctor
