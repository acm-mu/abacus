import { Container, MenuItem } from "semantic-ui-react"
import Navigation from "@/components/navigation"
import NavLink from "@/components/navlink"
import Countdown from "@/components/countdown"

export default function BluePage({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <Navigation className="blue-div">
        <MenuItem as={NavLink} href="/blue">Home</MenuItem>
        <MenuItem as={NavLink} href="/blue/rules">Rules</MenuItem>
        <MenuItem as={NavLink} href="/blue/problems">Problems</MenuItem>
        <MenuItem as={NavLink} href="/blue/standings">Standings</MenuItem>
      </Navigation>

      <Container text className="main">
        {children}
      </Container>
    </>
  )
}