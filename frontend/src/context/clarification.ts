import type { Clarification } from "abacus"
import { createContext } from "react"

export interface ClarificationContextType {
  clarifications?: Clarification[],
  selectedItem?: string,
  onSelectedItemChanged: (cid: string) => void,
  reloadClarifications: () => void
}

const ClarificationContext = createContext<ClarificationContextType>({
  onSelectedItemChanged: () => {
    return
  },
  reloadClarifications: () => {
    return
  }
})

export default ClarificationContext