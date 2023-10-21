import { AppContext } from 'context'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import Navigation from './base.navigation'

const EagleNavigation = (): React.JSX.Element => {
  const { user } = useContext(AppContext)
  const hasAccessTo = user?.role == 'admin' || user?.division == 'eagle'

  return <Navigation className="eagle-div">
    <Menu.Item as={NavLink} end to="/eagle" content="Home" />
    {hasAccessTo && <>
      <Menu.Item as={NavLink} to="/eagle/problem" content="Problem" />
      <Menu.Item as={NavLink} to="/eagle/clarifications" content="Clarifications" />
    </>}
  </Navigation>

}

export default EagleNavigation
