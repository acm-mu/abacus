import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Navigation } from "components";
import AppContext from "AppContext";

const BlueNavigation = (): JSX.Element => {
  const { settings } = useContext(AppContext)
  const { user } = useContext(AppContext);

  const hasAccessTo = () => user?.role == 'admin' || user?.division == 'blue'
  const isBeforeCompetition = () => !settings || new Date() < settings.start_date

  return (
    <Navigation className="blue-div">
      <Menu.Item as={NavLink} exact to="/blue" content="Home" />
      {hasAccessTo() ? <Menu.Item as={NavLink} to="/blue/problems" content="Problems" /> : <></>}
      <Menu.Item as={NavLink} to="/blue/standings" content="Standings" />
      {hasAccessTo() ? <Menu.Item as={NavLink} to="/blue/submissions" content="Submissions" /> : <></>}
      {hasAccessTo() ? <Menu.Item as={NavLink} to="/blue/clarifications" content="Clarifications" /> : <></>}
      {isBeforeCompetition() ? <Menu.Item as={NavLink} to='/blue/practice' content='Practice' /> : <></>}
    </Navigation>
  )
}

export default BlueNavigation;
