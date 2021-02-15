import React from "react";

import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Navigation } from "../../components";

const BlueNavigation = (): JSX.Element => (
  <Navigation className="blue-div">
    <Menu.Item as={NavLink} exact to="/blue" content="Home" />
    <Menu.Item as={NavLink} to="/blue/problems" content="Problems" />
    <Menu.Item as={NavLink} to="/blue/standings" content="Standings" />
    <Menu.Item as={NavLink} to="/blue/submissions" content="Submissions" />
    <Menu.Item as={NavLink} to="/blue/clarifications" content="Clarfications" />
  </Navigation>
);

export default BlueNavigation;
