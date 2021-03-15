import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { Block } from '../../components'
import Connect from './Connect'
import scratch from '../../assets/scratch.png'

const Home = (): JSX.Element => {
  const { user } = useContext(AppContext)
  return (
    <>
      {user?.scratch_username ? <></> :
        <Connect />
      }
      <Block size='xs-12'>
        <h1>Gold Division (Scratch)</h1>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '15px' }}>
          <img height='175px' src={scratch} />
        </div>

        <p></p>
      </Block>
    </>
  )
}

export default Home