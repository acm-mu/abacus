import React, { useContext } from 'react'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router'
import { Block } from 'components'
import { AppContext } from 'context'

import PracticeProblems from './Problems'
import SubmitPractice from './Submit'
import ProblemOrSubmission from './ProblemOrSubmission'

export type Problem = {
  id: string
  name: string
  year: number
}

const Practice = (): JSX.Element => {
  const { settings } = useContext(AppContext)

  if (!settings || new Date() > settings.start_date) {
    return (
      <>
        <title>Abacus | Practice</title>
        <Block size="xs-12">
          <h1>⏰ Practice Period Has Ended! ⏰</h1>
          <p>The practice period has closed because either the competition is in progress, or has ended.</p>
        </Block>
      </>
    )
  }

  return (
    <Switch>
      <Route path="/blue/practice/:id/submit" component={SubmitPractice} />
      <Route path="/blue/practice/:id" component={ProblemOrSubmission} />
      <Route path="/blue/practice" component={PracticeProblems} />
    </Switch>
  )
}

export default Practice
