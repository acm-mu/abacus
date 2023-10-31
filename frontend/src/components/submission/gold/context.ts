import type { IGoldSubmission, ISubmission } from "abacus"
import React, { createContext } from "react"

interface GoldSubmissionContextType {
  submission?: IGoldSubmission
  setSubmission?: React.Dispatch<React.SetStateAction<ISubmission | undefined>>
  rerunning?: boolean
}

const GoldContext = createContext<GoldSubmissionContextType>({})

export default GoldContext