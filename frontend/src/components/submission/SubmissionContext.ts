import { Submission } from "abacus"
import { createContext } from "react"

interface SubmissionContextType {
  submission: Submission | undefined
  rerunning?: boolean
}

const SubmissionContext = createContext<SubmissionContextType>({
  submission: undefined
})

export default SubmissionContext