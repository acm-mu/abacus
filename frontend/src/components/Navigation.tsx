import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import AppContext from "../AppContext";
import fulllogoy from '../assets/fulllogoy.png'
import LoginModal from "./Login";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Navigation: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory()
  const { user, setUser, loaded } = useContext(AppContext)
  const [isMounted, setMounted] = useState<boolean>(false)

  const handleLogout = () => {
    if (isMounted) {
      localStorage.removeItem('accessToken')
      // When clicking the logout button, the username onClick fires and redirects to user home. 
      // Redirect to homepage 20ms later
      setTimeout(() => {
        setUser(undefined)
        history.push('/')
      }, 1)

    }
  }

  useEffect(() => {
    setMounted(true)
    return () => { setMounted(false) }
  })

  const userHome = () => {
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
          <img className="logo" src={fulllogoy} alt="Abacus" />
        </Menu.Item>

        {props.children}

        {loaded && <Menu.Menu position="right">
          {user ?
            <Dropdown item simple
              text={user.display_name}
              onClick={() => { history.push(userHome()) }}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout} text="Log out" />
              </Dropdown.Menu>
            </Dropdown> :
            <LoginModal trigger={<Menu.Item content="Log in" />} />
          }
        </Menu.Menu>}
      </Container>
    </Menu >
  );
};

export default Navigation;
