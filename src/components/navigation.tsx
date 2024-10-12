import Image from "next/image";
import Link from "next/link";
import { Container, Dropdown, DropdownItem, DropdownMenu, Menu, MenuItem, MenuMenu } from "semantic-ui-react";

type NavigationProps = React.PropsWithChildren<{ className?: string }>

export default function Navigation(props: NavigationProps) {
  return (
    <Menu className={`fixed ${props.className}`} inverted>
      <Container>
        <MenuItem header as={Link} href="/">
          <Image src="/fulllogoy.png" width={70} height={20} className="logo" alt="abacus" />
        </MenuItem>

        {props.children}

        <MenuMenu position="right">
          <MenuItem>Log in</MenuItem>
        </MenuMenu>
      </Container>
    </Menu>
  )

}