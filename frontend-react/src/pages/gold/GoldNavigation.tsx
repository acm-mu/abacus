import React from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { Navigation } from "../../components";

const GoldNavigation = (): JSX.Element => (
  <Navigation>
    <Menu.Item as={NavLink} exact to="/gold">
      Home
    </Menu.Item>
  </Navigation>
);

export default GoldNavigation;
