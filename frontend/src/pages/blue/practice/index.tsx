import React, { useContext } from 'react'
import { Route, Routes, Outlet } from 'react-router-dom'
import { Block } from 'components'
import { AppContext } from 'context'

import PracticeProblems from './Problems'
import SubmitPractice from './Submit'
import ProblemOrSubmission from './ProblemOrSubmission'
import { usePageTitle } from 'hooks'

export type Problem = {
  id: string
  name: string
  year: number
}

const Practice = (): React.JSX.Element => {
  usePageTitle("Abacus | Practice")

  const { settings } = useContext(AppContext)

  if (!settings || new Date() > settings.start_date) {
    return <Block size="xs-12">
      <h1>⏰ Practice Period Has Ended! ⏰</h1>
      <p>The practice period has closed because either the competition is in progress, or has ended.</p>
    </Block>
  }

  return (
    <Routes>
      <Route path="practice" element={<Outlet />} >
        <Route path=":id/submit" element={<SubmitPractice />} />
        <Route path=":id" element={<ProblemOrSubmission />} />
        <Route path="" element={<PracticeProblems />} />
      </Route>
    </Routes>
  )
}

export default Practice
