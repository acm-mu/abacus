import React, { useContext } from 'react'
import { Block } from '../../components'
import { UserContext } from '../../context/user'
import Connect from './Connect'

const Home = (): JSX.Element => {
  const { user } = useContext(UserContext)
  return (
    <>
      {user?.scratch_username ? <></> :
        <Connect />
      }
      <Block size='xs-12'>
        <h1>Gold Home</h1>
      </Block>
    </>
  )
}

export default Home