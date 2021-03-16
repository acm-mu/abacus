import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Navigation } from "components";
import AppContext from "AppContext";

const BlueNavigation = (): JSX.Element => {
  const { user } = useContext(AppContext);

  return (
    <Navigation className="blue-div">
      <Menu.Item as={NavLink} exact to="/blue" content="Home" />
      {user ? <Menu.Item as={NavLink} to="/blue/problems" content="Problems" /> : <></>}
      <Menu.Item as={NavLink} to="/blue/standings" content="Standings" />
      {user ? <Menu.Item as={NavLink} to="/blue/submissions" content="Submissions" /> : <></>}
      {user ? <Menu.Item as={NavLink} to="/blue/clarifications" content="Clarifications" /> : <></>}
    </Navigation>
  )
}

export default BlueNavigation;
