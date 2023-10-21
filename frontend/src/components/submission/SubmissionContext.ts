import type { ISubmission } from 'abacus'
import React, { createContext } from 'react'

interface SubmissionContextType {
  submission: ISubmission | undefined
  setSubmission?: React.Dispatch<React.SetStateAction<ISubmission | undefined>>
  rerunning?: boolean
}

const SubmissionContext = createContext<SubmissionContextType>({
  submission: undefined
})

export default SubmissionContext
