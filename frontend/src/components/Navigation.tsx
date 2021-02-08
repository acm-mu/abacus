import React, { useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { useAuth } from "../authlib";
import { UserContext } from "../context/user";

type Props = {
  children: React.ReactNode;
};

const Navigation: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory()
  const { user, setUser } = useContext(UserContext)
  const [isAuthenticated, setAuthenticated] = useAuth(user)

  const handleLogout = () => {
    setUser(undefined)
    setAuthenticated(false)
    history.push('/')
  }

  return (
    <Menu className="fixed" inverted>
      <Container>
        <Menu.Item as={Link} to="/" header>
          <img className="logo" src="/images/fulllogoy.png" alt="Abacus" />
        </Menu.Item>

        {props.children}

        <Menu.Menu position="right">
          {isAuthenticated ?
            <Dropdown item text={user?.username} simple>
              <Dropdown.Menu>
                {user?.role == 'admin' && <Menu.Item as={Link} to='/admin/settings'>Settings</Menu.Item>}
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
