import React, {useEffect} from 'react'
import { Block } from 'components'

const Home = (): React.JSX.Element => {

  useEffect(() => {
    document.title = "Abacus | Eagle Division"
  }, [])

  return <Block size="xs-12">
    <h1>Eagle Division</h1>
    <h2>Overview</h2>
    <p>
      Teams of two to four students will be working together to solve a problem that is present in society and is
      awaiting a technological solution. The students then have three hours to develop a solution using their
      knowledge of computer science principles and technologies. Students are required to write some code/create a
      working prototype. We are not expecting a flushed out UI, but a program of some sort that accomplishes their
      implementation/solution to the problem is what we are aiming for. At the end of the three hours, each team
      will present (5 – 10 minutes) their solution to a small board of faculty and/or student members. The board
      will ask a few questions and ultimately vote on a winner. For in-person teams, we will have a room for teams
      to present in. For virtual teams, we will have a Teams meeting where students will present.
    </p>
  </Block>
}

export default Home
