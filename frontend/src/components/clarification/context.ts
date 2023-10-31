import { createContext } from "react"

interface ClarificationContextType {
  reloadClarifications: () => Promise<void>,
  activeItem?: string
  setActiveItem: (item: string) => void
}

const ClarificationContext = createContext<ClarificationContextType>({
  reloadClarifications: async () => {
    return
  },
  setActiveItem: () => {
    return
  }
})

export default ClarificationContext