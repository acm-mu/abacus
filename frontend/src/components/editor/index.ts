import type { IProblem } from 'abacus'

export interface ProblemStateProps {
  problem?: IProblem
  setProblem?: React.Dispatch<React.SetStateAction<IProblem>>
}

export { default as ProblemEditor } from './ProblemEditor'
