import React from "react";

import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

type Props = {
  children: React.ReactNode;
};

const Navigation: React.FunctionComponent<Props> = (props: Props) => (
  <Menu className="fixed" inverted>
    <Container>
      <Menu.Item as={Link} to="/" header>
        <img className="logo" src="/images/fulllogoy.png" alt="Abacus" />
      </Menu.Item>

      {props.children}
    </Container>
  </Menu>
);

export default Navigation;
