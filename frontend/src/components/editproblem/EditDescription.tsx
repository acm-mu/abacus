import MDEditor from "@uiw/react-md-editor"
import React from "react"
import { ProblemStateProps } from "."

export const EditDescription = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  if (!problem || !setProblem) return <></>

  const handleTextareaChange = (value: string | undefined) =>
    setProblem({ ...problem, description: value || '' })

  return <MDEditor
    value={problem?.description || ''}
    onChange={handleTextareaChange}
    height="500" />
}

export default EditDescription