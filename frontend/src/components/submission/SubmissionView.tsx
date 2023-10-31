import type { IBlueSubmission, IGoldSubmission, ISubmission } from 'abacus'
import React from 'react'
import { BlueSubmission, BlueSubmissionContext } from "./blue"
import { GoldSubmission, GoldSubmissionContext } from "./gold"

interface SubmissionProps {
  submission: ISubmission
  setSubmission?: React.Dispatch<React.SetStateAction<ISubmission | undefined>>
  rerunning?: boolean
}

const SubmissionView = ({ submission, setSubmission, rerunning }: SubmissionProps): React.JSX.Element => {

  if (submission.division == 'blue') {
    return <BlueSubmissionContext.Provider
      value={{ submission: submission as IBlueSubmission, setSubmission, rerunning }}>
      <BlueSubmission />
    </BlueSubmissionContext.Provider>
  }

  if (submission.division == 'gold') {
    return <GoldSubmissionContext.Provider
      value={{ submission: submission as IGoldSubmission, setSubmission, rerunning }}>
      <GoldSubmission />
    </GoldSubmissionContext.Provider>
  }

  return <p>Error loading submission!</p>
}

export default SubmissionView
