import type { IBlueProblem, IGoldProblem, IProblem } from "abacus"
import { ScratchViewer } from 'components'
import React, { ChangeEvent } from 'react'
import { Form, InputOnChangeData } from 'semantic-ui-react'

interface TemplateEditorProps {
  problem: IGoldProblem
  setProblem: React.Dispatch<React.SetStateAction<IGoldProblem | IProblem | IBlueProblem>>
}

const TemplateEditor = ({ problem, setProblem }: TemplateEditorProps): React.JSX.Element => {
  if (!problem || !setProblem) return <></>

  const handleChange = (_event: ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) =>
    setProblem({ ...problem, project_id: value })

  return (
    <Form>
      <Form.Input
        label="Scratch Project Id"
        name="project_id"
        value={problem.project_id}
        onChange={handleChange}
        placeholder="#########"
      />
      {problem.project_id ? <ScratchViewer project_id={problem.project_id} /> : <></>}
    </Form>
  )
}

export default TemplateEditor
