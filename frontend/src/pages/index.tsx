import { NotFound } from 'components'
import { DefaultNavigation } from 'components/navigation'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import About from './About'
import Clarifications from './Clarifications'
import Help from './Help'
import Home from './Home'

export const Index = (): React.JSX.Element => <>
  <DefaultNavigation />
  <Container text className="main">
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="help" element={<Help />} />
      <Route path="clarifications/*" element={<Clarifications />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Container>
</>

export { default as Gold } from './gold'
export { default as Blue } from './blue'
export { default as Eagle } from './eagle'
export { default as Admin } from './admin'
export { default as Judge } from './judge'
export { default as Proctor } from './proctor'
