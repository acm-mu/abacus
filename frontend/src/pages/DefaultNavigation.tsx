import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { Navigation } from "../components";
import { NavLink } from "react-router-dom";

const DefaultNavigation = (): JSX.Element => (
  <Navigation>
    <Menu.Item as={NavLink} exact to="/">
      Home
    </Menu.Item>

    <Dropdown as={Menu.Item} text="Divisions" simple>
      <Dropdown.Menu>
        <Dropdown.Item as={NavLink} to="/blue" text="Blue" />
        <Dropdown.Item as={NavLink} to="/gold" text="Gold" />
        <Dropdown.Item as={NavLink} to="/eagle" text="Eagle" />
      </Dropdown.Menu>
    </Dropdown>

    <Menu.Item as={NavLink} to="/about">
      About
    </Menu.Item>

    <Menu.Item as={NavLink} to="/help">
      Help
    </Menu.Item>

    <Menu.Menu position="right">
      <Menu.Item as={NavLink} to="/login">
        Log in
      </Menu.Item>
    </Menu.Menu>
  </Navigation>
);

export default DefaultNavigation;

// import React from 'react'
// import { Route, Link, NavLink } from 'react-router-dom'
// import { Menu, Dropdown, Container } from 'semantic-ui-react'
// import { Home, About, Login } from './index/'

// import { Navigation } from '../components'

// export { default as Blue } from './Blue'
// export { default as Gold } from './Gold'

// export const Index: React.FunctionComponent = () => {
//   return (
//     <>
//     <Navigation>
//     <Menu.Item as={NavLink} exact to="/">
//           Home
//         </Menu.Item>

//         <Dropdown as={Menu.Item} text="Divisions" simple>
//           <Dropdown.Menu>
//             <Dropdown.Item as={NavLink} to="/blue" text="Blue" />
//             <Dropdown.Item as={NavLink} to="/gold" text="Gold" />
//             <Dropdown.Item as={NavLink} to="/eagle" text="Eagle" />
//           </Dropdown.Menu>
//         </Dropdown>

//         <Menu.Item as={NavLink} to="/about">
//           About
//         </Menu.Item>

//         <Menu.Item as={NavLink} to="/help">
//           Help
//         </Menu.Item>

//         <Menu.Menu position="right">
//           <Menu.Item as={Link} to="/login">
//             Log in
//           </Menu.Item>
//         </Menu.Menu>
//     </Navigation>
//     <Container text className='main'>
//     <Route exact path='/' component={Home} />
//       <Route path='/about' component={About} />
//       <Route path='/login' component={Login} />
//     </Container>
//     </>
//   )
// }
