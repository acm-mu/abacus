import MDEditor from '@uiw/react-md-editor'
import React from 'react'
import { ProblemStateProps } from '.'

export const DescriptionEditor = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  if (!problem || !setProblem) return <></>

  return (
    <MDEditor
      value={problem?.description || ''}
      onChange={(value) => setProblem({ ...problem, description: value || '' })}
      height={500}
    />
  )
}

export default DescriptionEditor
