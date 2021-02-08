import React, { useContext } from "react"
import { Block } from "../components"
import { SocketContext } from "../context/socket"

const Clarifications = (): JSX.Element => {
  const socket = useContext(SocketContext)

  socket.on('new_clarification', () => {
    console.log('New Clarification!')
  })

  return (
    <Block size='xs-12'>
      <h1>Clarifications</h1>
    </Block>
  )
}

export default Clarifications