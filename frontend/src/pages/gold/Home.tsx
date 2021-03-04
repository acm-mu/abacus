import React, { useContext } from 'react'
import { AppContext } from '../../AppContext'
import { Block } from '../../components'
import Connect from './Connect'

const Home = (): JSX.Element => {
  const { user } = useContext(AppContext)
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