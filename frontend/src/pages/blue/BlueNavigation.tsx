import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Navigation } from "components";
import AppContext from "AppContext";

const BlueNavigation = (): JSX.Element => {
  const { settings } = useContext(AppContext)

  return (
    <Navigation className="blue-div">
      <Menu.Item as={NavLink} exact to="/blue" content="Home" />
      <Menu.Item as={NavLink} to="/blue/problems" content="Problems" />
      <Menu.Item as={NavLink} to="/blue/standings" content="Standings" />
      <Menu.Item as={NavLink} to="/blue/submissions" content="Submissions" />
      <Menu.Item as={NavLink} to="/blue/clarifications" content="Clarifications" />

      {(!settings || new Date() < settings.start_date) &&
        <Menu.Item as={NavLink} to='/blue/practice' content='Practice' />}
    </Navigation>
  )
}

export default BlueNavigation;
