import React, { useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { Navigation } from 'components'
import { AppContext } from 'context'

const GoldNavigation = (): React.JSX.Element => {
  const { user, settings } = useContext(AppContext)

  const hasAccessTo = () => user?.role == 'admin' || user?.division == 'gold'

  return (
    <Navigation className="gold-div">
      <Menu.Item as={NavLink} end to="/gold" content="Home" />
      <Menu.Item as={NavLink} to="/gold/rules" content="Rules" />
      {hasAccessTo() || (settings && new Date() > settings.end_date) ? (
        <Menu.Item as={NavLink} to="/gold/problems" content="Problems" />
      ) : (
        <></>
      )}
      <Menu.Item as={NavLink} to="/gold/standings" content="Standings" />
      {hasAccessTo() ? <Menu.Item as={NavLink} to="/gold/submissions" content="Submissions" /> : <></>}
      {hasAccessTo() ? <Menu.Item as={NavLink} to="/gold/clarifications" content="Clarifications" /> : <></>}
    </Navigation>
  )
}

export default GoldNavigation
