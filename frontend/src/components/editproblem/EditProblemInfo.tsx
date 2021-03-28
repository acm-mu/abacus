import React, { ChangeEvent } from 'react';
import { Form, Input } from 'semantic-ui-react';
import { ProblemStateProps } from '.';

const EditProblemInfo = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => problem && setProblem({ ...problem, [name]: value })

  return <Form>
    <Form.Field label='Problem ID' name='id' control={Input} onChange={handleChange} value={problem?.id || ''} />
    <Form.Field label='Problem Name' name='name' control={Input} onChange={handleChange} value={problem?.name || ''} />
    {problem?.division == 'blue' ? <Form.Group widths='equal'>
      <Form.Field label='Memory Limit' name='memory_limit' control={Input} onChange={handleChange} value={problem?.memory_limit || -1} />
      <Form.Field label='CPU Time Limit' name='cpu_time_limit' control={Input} onChange={handleChange} value={problem?.cpu_time_limit || -1} />
    </Form.Group> : <></>}
  </Form>
}

export default EditProblemInfo