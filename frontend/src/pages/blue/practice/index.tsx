import React, { useContext, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import { Route, useParams } from "react-router";
import SubmitPractice from "./Submit";
import AppContext from "AppContext";
import { Block, NotFound } from "components";

import PracticeSubmission from "./Submission";
import PracticeProblem from "./Problem";
import PracticeProblems from "./Problems";
import { Submission } from "abacus";
import { Loader } from "semantic-ui-react";
import { Helmet } from "react-helmet";

export type Problem = {
  id: string;
  name: string;
  year: number;
}

const Practice = (): JSX.Element => {
  const [isMounted, setMounted] = useState(true)
  const { settings } = useContext(AppContext)
  const [problems, setProblems] = useState<{ [key: string]: Problem }>({})
  const submissions: { [key: string]: Submission } = localStorage.submissions ? JSON.parse(localStorage.submissions) : {}
  const [isLoading, setLoading] = useState(true)

  const helmet = <Helmet> <title>Abacus | Practice</title> </Helmet>

  const loadProblems = async () => {
    const response = await fetch('/problems/index.json')
    if (!isMounted) return
    setProblems(await response.json())
    setLoading(false)
  }

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  if (isLoading) {
    return <>
      {helmet}
      <Loader active inline='centered' content="Loading..." />
    </>
  }

  if (!settings || (new Date()) > settings.start_date) {
    return <>
      {helmet}
      <Block size='xs-12'>
        <h1>⏰ Practice Period Has Ended! ⏰</h1>
        <p>The practice period has closed because either the competition is in progress, or has ended.</p>
      </Block>
    </>
  }

  return <Switch>
    <Route path='/blue/practice/:id/submit' component={SubmitPractice} />
    <Route exact path='/blue/practice' component={() => <PracticeProblems problems={problems} submissions={submissions} />} />
    <Route path='/blue/practice/:id' component={() => {
      const { id } = useParams<{ id: string }>()

      if (id in submissions) return <PracticeSubmission submission={submissions[id]} />
      else if (id in problems) return <PracticeProblem submissions={Object.values(submissions).filter(submission => submission.pid == id)} />
      else return <NotFound />
    }} />
  </Switch>

}
export default Practice;
