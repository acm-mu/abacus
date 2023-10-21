import { NotFound } from 'components'
import { EagleNavigation } from 'components/navigation'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import Clarifications from '../Clarifications'
import Home from './Home'
import Problem from './Problem'

const Eagle = (): React.JSX.Element => (
  <>
    <EagleNavigation />
    <Container text className="main">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="problem" element={<Problem />} />
        <Route path="clarifications/:cid" element={<Clarifications />} />
        <Route path="clarifications" element={<Clarifications />} />
        <Route element={<NotFound />} />
      </Routes>
    </Container>
  </>
)

export default Eagle
