import { ScratchViewer } from 'components'
import React, { ChangeEvent } from 'react'
import { Form, InputOnChangeData } from 'semantic-ui-react'
import { ProblemStateProps } from '.'

const TemplateEditor = ({ problem, setProblem }: ProblemStateProps): React.JSX.Element => {
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
