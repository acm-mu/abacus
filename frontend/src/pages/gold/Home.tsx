import React, { useContext } from 'react'
import AppContext from 'AppContext'
import { Block } from 'components'
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

        <p>
          A team-based programming competition for high school students just beginning their programming education.
          Teams of two or three students will have three hours to work collaboratively to solve problems focused on
          logic, mathematics, and creativity. Points will be awarded based on the number of problems correctly solved
          and original creative ideas. Appropriate penalties will be deducted for incorrect submissions or academic
          dishonesty. Each question is written using <a href="https://scratch.mit.edu/" target="_blank" rel="noreferrer">Scratch</a>,
          an event driven, block-based, visual programming language developed at
          the <a href="https://www.media.mit.edu/" target="_blank" rel="noreferrer">MIT Media Lab</a> at the Massachusetts Institute of Technology.
        </p>
      </Block>
    </>
  )
}

export default Home