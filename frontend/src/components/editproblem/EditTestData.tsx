import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { Form, Menu, MenuItemProps, TextArea } from 'semantic-ui-react';
import { ProblemStateProps } from '.';

const EditTestData = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const [activeTestItem, setActiveTestItem] = useState(0)

  if (!problem || !setProblem) return <></>

  const handleTestItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)
  const handleNewTest = () => {
    setProblem({ ...problem, tests: [...problem.tests, { in: '', out: '', include: false }] })
    setActiveTestItem(problem.tests.length)
  }
  const handleDeleteTest = () => {
    setActiveTestItem(problem.tests.length - 2)
    setProblem({ ...problem, tests: problem.tests.filter((_, index) => index != activeTestItem) })
  }

  const handleTestChange = ({ target: { name, value, style, scrollHeight } }: ChangeEvent<HTMLTextAreaElement>) => {
    style.height = `${scrollHeight}px`
    setProblem({
      ...problem, tests: problem.tests?.map((test, index) => {
        if (name == `${index}-in`)
          test.in = value
        else if (name == `${index}-out`)
          test.out = value
        return test
      })
    })
  }

  return <Form>
    <Menu>
      {problem?.tests?.map((test, index) => (
        <Menu.Item name={`${index + 1}`} key={`${index}-test-tab`} tab={index} active={activeTestItem === index} onClick={handleTestItemClick} />
      ))}
      <Menu.Menu position='right'>
        <Menu.Item onClick={handleNewTest}>New</Menu.Item>
        <Menu.Item onClick={handleDeleteTest}>Delete</Menu.Item>
      </Menu.Menu>
    </Menu>

    {problem.tests?.map((test, index) => (
      <div key={`test-${index}`}>
        {activeTestItem == index ?
          <Form.Group widths='equal'>
            <Form.Field style={{ height: '18em' }} label='Input' onChange={handleTestChange} control={TextArea} name={`${index}-in`} value={test.in} />
            <Form.Field style={{ height: '18em' }} label='Answer' onChange={handleTestChange} control={TextArea} name={`${index}-out`} value={test.out} />
          </Form.Group>
          : <></>}
      </div>
    ))}
  </Form>
}

export default EditTestData