import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, Routes } from 'react-router-dom'
import { NotFound } from 'components'
import EagleNavigation from './EagleNavigation'
import Home from './Home'
import Problem from './Problem'
import Clarifications from '../Clarifications'

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
