import React from "react";

import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { isAuthenticated, logout, getuserinfo, hasRole, userhome } from "../authlib";

type Props = {
  children: React.ReactNode;
};

const Navigation: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory()

  const handleLogout = () => {
    logout();
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
          {isAuthenticated() ?
            <Dropdown item as={Link} to={userhome()} text={getuserinfo('username')} simple>
              <Dropdown.Menu>
                {hasRole('admin') && <Menu.Item as={Link} to='/admin/settings'>Settings</Menu.Item>}
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
