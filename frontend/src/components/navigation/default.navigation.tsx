import { AppContext } from 'context'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import Navigation from './base.navigation'

const DefaultNavigation = (): React.JSX.Element => {
  const { user } = useContext(AppContext)
  const userIsProctor = user && user.role != 'proctor'

  return <Navigation>
    <Menu.Item as={NavLink} end to="/" content="Home" />

    <Dropdown item text="Divisions" simple>
      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/blue" text="Blue" />
        <Dropdown.Item as={NavLink} to="/gold" text="Gold" />
        <Dropdown.Item as={NavLink} to="/eagle" text="Eagle" />
      </Dropdown.Menu>
    </Dropdown>

    <Menu.Item as={NavLink} to="/about" content="About" />
    <Menu.Item as={NavLink} to="/help" content="Help" />

    {userIsProctor && <Menu.Item as={NavLink} to="/clarifications" content="Clarifications" />}
  </Navigation>
}

export default DefaultNavigation
