import React from 'react'
import { Block } from 'components'
import scratch from '../../assets/scratch.png'
import { Helmet } from 'react-helmet'
import { Button } from 'semantic-ui-react'

const Home = (): JSX.Element => <>
  <Helmet>
    <title>Abacus | Gold</title>
  </Helmet>

  <Block size='xs-12'>
    <h1>Gold Division (Scratch)</h1>
    <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '15px' }}>
      <img height='175px' src={scratch} />
    </div>

    <p>
      A team-based programming competition for high school students just beginning their programming education. Teams of two or three students will have three hours to work collaboratively to solve problems focused on logic, mathematics, and creativity. Points will be awarded based on the number of problems correctly solved and original creative ideas. Appropriate penalties will be deducted for incorrect submissions or academic dishonesty. Each question is written using <a href="https://scratch.mit.edu/" target="_blank" rel="noreferrer">Scratch</a>, an event driven, block-based, visual programming language developed at the <a href="https://www.media.mit.edu/" target="_blank" rel="noreferrer">MIT Media Lab</a> at the Massachusetts Institute of Technology.
    </p>
  </Block>
  <Block size='xs-12'>
    <p>Save this bookmark to your toolbar to easily submit your scratch projects.</p>

    <Button as={'a'} href='javascript:(function(){const regex = /https:\/\/scratch\.mit\.edu\/projects\/(.*)/;
  const project_id = window.location.href.match(regex)[1]; window.open(`http://localhost:3000/gold/submit/${project_id}`)}())'>Submit to Abacus</Button>
  </Block>
</>


export default Home