import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Navigation } from 'components';

const DefaultNavigation = (): JSX.Element => (
  <Navigation>
    <Menu.Item as={NavLink} exact to="/">
      Home
     </Menu.Item>

    <Dropdown item text="Divisions" simple>
      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/blue" text="Blue" />
        <Dropdown.Item as={NavLink} to="/gold" text="Gold" />
      </Dropdown.Menu>
    </Dropdown>

    <Menu.Item as={NavLink} to="/about">
      About
     </Menu.Item>

    <Menu.Item as={NavLink} to="/help">
      Help
     </Menu.Item>
  </Navigation>
);

export default DefaultNavigation;