import React, { ChangeEvent } from 'react';
import { Form, Input, Select } from 'semantic-ui-react';
import { divisions } from 'utils';
import { ProblemStateProps } from '.';

const ProblemInfoEditor = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  if (!problem || !setProblem) return <></>

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => setProblem({ ...problem, [name]: value })
  const handleSelectChange = (_: never, { value }: HTMLInputElement) => {
    if (value == 'gold') {
      setProblem({
        ...problem,
        division: 'gold',
        skeletons: undefined,
        solutions: undefined,
        tests: undefined
      })
    } else if (value == 'blue') {

      const filename = problem.name.replace(/[ !@#$%^&*()-]/g, '')
      setProblem({
        ...problem,
        division: 'blue',
        project_id: undefined,
        skeletons: [{ source: '# Python skeleton goes here', file_name: `${filename}.py`, language: 'python' }, { source: '// Java skeleton goes here', file_name: `${filename}.py`, language: 'java' }],
        solutions: [{ source: '# Python solution goes here', file_name: `${filename}.java`, language: 'python' }, { source: '// Java solution goes here', file_name: `${filename}.java`, language: 'java' }],
        tests: [{ in: '', out: '' }]
      })
    }
  }

  return <Form>
    <Form.Group widths='equal'>
      <Form.Field label='Problem ID' name='id' control={Input} onChange={handleChange} value={problem?.id || ''} />
      <Form.Field label='Problem Name' name='name' control={Input} onChange={handleChange} value={problem?.name || ''} />
      <Form.Field
        control={Select}
        onChange={handleSelectChange}
        label='Division'
        name='division'
        options={divisions}
        value={problem?.division || ''}
        placeholder='Division'
        required />
    </Form.Group>

    {problem?.division == 'blue' ? <Form.Group widths='equal'>
      <Form.Field label='Memory Limit' name='memory_limit' control={Input} onChange={handleChange} value={problem?.memory_limit || ''} />
      <Form.Field label='CPU Time Limit' name='cpu_time_limit' control={Input} onChange={handleChange} value={problem?.cpu_time_limit || ''} />
    </Form.Group> : <></>}
  </Form>
}

export default ProblemInfoEditor