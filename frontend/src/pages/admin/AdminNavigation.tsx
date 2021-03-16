import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { Navigation } from 'components'

const AdminNavigation = (): JSX.Element => (
  <Navigation className="admin-div">
    <Menu.Item as={NavLink} exact to="/admin/" content="Home" />
    <Menu.Item as={NavLink} to="/admin/users" content="Users" />
    <Menu.Item as={NavLink} to="/admin/problems" content="Problems" />
    <Menu.Item as={NavLink} to="/admin/submissions" content="Submissions" />
    <Menu.Item as={NavLink} to="/admin/clarifications" content="Clarifications" />
    <Menu.Item as={NavLink} to="/admin/settings" content="Settings" />
  </Navigation>
)

export default AdminNavigation