import React, { useContext, useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { useAuth } from "../authlib";
import { UserContext } from "../context/user";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Navigation: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory()
  const { user, setUser } = useContext(UserContext)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [isAuthenticated, setAuthenticated] = useAuth(user, isMounted)

  const handleLogout = () => {
    if (isMounted) {
      setUser(undefined)
      setAuthenticated(false)
      history.push('/')
    }
  }

  useEffect(() => {
    setMounted(true)
    return () => { setMounted(false) }
  })

  const userHistory = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'team':
        switch (user.division) {
          case 'gold':
            return '/gold';
          case 'blue':
            return '/blue'
          default:
            return '/'
        }
      default:
        return '/';
    }
  }

  return (
    <Menu className={`fixed ${props.className}`} inverted>
      <Container>
        <Menu.Item as={Link} to="/" header>
          <img className="logo" src="/images/fulllogoy.png" alt="Abacus" />
        </Menu.Item>

        {props.children}

        <Menu.Menu position="right">
          {isAuthenticated ?
            <Dropdown item text={user?.username} onClick={() => { history.push(userHistory()) }} simple>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout} text="Log out" />
              </Dropdown.Menu>
            </Dropdown> :
            <Menu.Item as={Link} to="/login" content="Log in" />
          }
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default Navigation;
