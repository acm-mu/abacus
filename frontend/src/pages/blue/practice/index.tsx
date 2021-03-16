import React, { useContext } from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router";

import PracticeSubmission from "./Submission";
import SubmitPractice from "./Submit";
import PracticeProblem from "./Problem";
import AppContext from "AppContext";
import { Block } from "components";


const Practice = (): JSX.Element => {
  const { settings } = useContext(AppContext)

  if (!settings || (new Date()) > settings.start_date) {
    return <>
      <Block size='xs-12'>
        <h1>⏰ Practice Period Has Ended! ⏰</h1>
        <p>The practice period has closed because either the competition is in progress, or has ended.</p>
      </Block>
    </>
  }
  return (
    <Switch>
      <Route path='/blue/practice/submit' component={SubmitPractice} />
      <Route path='/blue/practice/:sid' component={PracticeSubmission} />
      <Route path='/blue/practice' component={PracticeProblem} />
    </Switch>
  )
}
export default Practice;
