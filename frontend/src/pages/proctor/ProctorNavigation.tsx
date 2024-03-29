import React from 'react'
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { Navigation } from 'components'

const JudgeNavigation = (): React.JSX.Element => (
  <Navigation className="proctor-div">
    <Menu.Item as={NavLink} end to="/proctor" content="Home" />
    <Menu.Item as={NavLink} to="/proctor/problems" content="Problems" />
    <Menu.Item as={NavLink} to="/proctor/submissions" content="Submissions" />
  </Navigation>
)

export default JudgeNavigation
