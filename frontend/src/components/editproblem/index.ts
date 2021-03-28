import { Problem } from "abacus";

export interface ProblemStateProps {
  problem?: Problem;
  setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>
}

export { default as EditDescription } from './EditDescription'
export { default as EditProblemInfo } from './EditProblemInfo'
export { default as EditTestData } from './EditTestData'
export { default as EditSkeletons } from './EditSkeletons'
export { default as EditSolutions } from './EditSolutions'