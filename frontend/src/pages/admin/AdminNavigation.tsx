import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { Navigation } from '../../components'

const AdminNavigation = (): JSX.Element => (
  <Navigation>
    <Menu.Item as={NavLink} exact to="/admin/">
      Home
     </Menu.Item>
    <Menu.Item as={NavLink} to="/admin/users">
      Users
     </Menu.Item>
    <Menu.Item as={NavLink} to="/admin/problems">
      Problems
     </Menu.Item>
    <Menu.Item as={NavLink} to="/admin/submissions">
      Submissions
     </Menu.Item>
    <Menu.Item as={NavLink} to="/admin/clarifications">
      Clarifications
     </Menu.Item>
  </Navigation>
)

export default AdminNavigation