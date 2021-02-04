import React from "react";

import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { isAuthenticated, logout, getuserinfo } from "../authlib";

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
            <Dropdown item text={getuserinfo('user_name')} simple>
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
