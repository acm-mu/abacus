import React, { useContext } from 'react';
import { Menu, Dropdown, MenuMenu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Navigation } from 'components';
import AppContext from 'AppContext';

const DefaultNavigation = (): JSX.Element => {
  const { user } = useContext(AppContext)

  return <Navigation>
    <Menu.Item as={NavLink} exact to="/">Home</Menu.Item>

    <Dropdown item text="Divisions" simple>
      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/blue" text="Blue" />
        <Dropdown.Item as={NavLink} to="/gold" text="Gold" />
      </Dropdown.Menu>
    </Dropdown>

    <Menu.Item as={NavLink} to="/about">About</Menu.Item>
    <Menu.Item as={NavLink} to="/help">Help</Menu.Item>

    {user ? <Menu.Item as={NavLink} to='/clarifications' content="Clarifications" /> : <></>}
  </Navigation>
}

export default DefaultNavigation;