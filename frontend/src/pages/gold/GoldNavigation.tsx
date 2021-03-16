import React, { useContext } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { Navigation } from "components";
import AppContext from "AppContext";

const GoldNavigation = (): JSX.Element => {
  const { user } = useContext(AppContext)

  return (
    <Navigation className="gold-div">
      <Menu.Item as={NavLink} exact to="/gold" content="Home" />
      {user ? <Menu.Item as={NavLink} to="/gold/problems" content="Problems" /> : <></>}
      <Menu.Item as={NavLink} to="/gold/standings" content="Standings" />
      {user ? <Menu.Item as={NavLink} to="/gold/submissions" content="Submissions" /> : <></>}
      {user ? <Menu.Item as={NavLink} to="/gold/clarifications" content="Clarifications" /> : <></>}
    </Navigation>
  )
}

export default GoldNavigation;
