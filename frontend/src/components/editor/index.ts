import React from 'react'
import type { IBlueProblem, IGoldProblem, IProblem } from 'abacus'

export interface ProblemStateProps {
  problem?: IGoldProblem | IBlueProblem | IProblem
  setProblem?: React.Dispatch<React.SetStateAction<IGoldProblem | IBlueProblem | IProblem>>
}

export { default as ProblemEditor } from './ProblemEditor'
