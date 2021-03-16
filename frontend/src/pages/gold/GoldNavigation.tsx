import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { Navigation } from "components";

const GoldNavigation = (): JSX.Element => (
  <Navigation className="gold-div">
    <Menu.Item as={NavLink} exact to="/gold" content="Home" />
    <Menu.Item as={NavLink} to="/gold/problems" content="Problems" />
    <Menu.Item as={NavLink} to="/gold/standings" content="Standings" />
    <Menu.Item as={NavLink} to="/gold/submissions" content="Submissions" />
    <Menu.Item as={NavLink} to="/gold/clarifications" content="Clarifications" />
  </Navigation>
);

export default GoldNavigation;
