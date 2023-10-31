import type { IBlueSubmission, ISubmission } from 'abacus'
import React, { createContext } from 'react'

interface BlueSubmissionContextType {
  submission?: IBlueSubmission
  setSubmission?: React.Dispatch<React.SetStateAction<ISubmission | undefined>>
  rerunning?: boolean
}

const BlueSubmissionContext = createContext<BlueSubmissionContextType>({
  submission: undefined
})

export default BlueSubmissionContext
