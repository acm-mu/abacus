import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import Navigation from './base.navigation'

const JudgeNavigation = (): React.JSX.Element =>
  <Navigation className="judge-div">
    <Menu.Item as={NavLink} end to="/judge" content="Home" />
    <Menu.Item as={NavLink} to="/judge/teams" content="Teams" />
    <Menu.Item as={NavLink} to="/judge/problems" content="Problems" />
    <Menu.Item as={NavLink} to="/judge/submissions" content="Submissions" />
    <Menu.Item as={NavLink} to="/judge/clarifications" content="Clarifications" />
  </Navigation>

export default JudgeNavigation
