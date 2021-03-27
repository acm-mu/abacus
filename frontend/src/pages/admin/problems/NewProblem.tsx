import { Test } from 'abacus'
import React, { SyntheticEvent, MouseEvent, ChangeEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Menu, TextArea, Message, MenuItemProps, DropdownProps } from "semantic-ui-react"
import MDEditor from '@uiw/react-md-editor'
import { Block } from 'components'
import { divisions } from 'utils'
import config from 'environment'

interface NewProblemType {
  id: string,
  name: string,
  division?: string,
  description: string,
  tests: Test[],
  cpu_time_limit?: number,
  memory_limit?: number
}

const NewProblem = (): JSX.Element => {
  const history = useHistory()
  const [problem, setProblem] = useState<NewProblemType>({
    id: '', name: '', description: '', tests: []
  })
  const [message, setMessage] = useState<{ type: string, message: string }>()
  const handleSubmit = async () => {
    const res = await fetch(`${config.API_URL}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify(problem)
    })
    const body = await res.json()
    if (res.status == 200) {
      history.push(`/admin/problems`)
    } else {
      setMessage({ type: 'error', message: body.message })
    }
  }

  const [activeTestItem, setActiveTestItem] = useState(0)
  const handleTestItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)
  const handleNewTest = () => {
    if (problem) {
      setProblem({ ...problem, tests: [...problem.tests, { in: '', out: '', result: '', include: false }] })
      setActiveTestItem(problem.tests.length)
    }
  }
  const handleDeleteTest = () => {
    if (problem) {
      setActiveTestItem(problem.tests.length - 2)
      setProblem({ ...problem, tests: problem.tests.filter((_: Test, index: number) => index != activeTestItem) })
    }
  }

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => problem &&
    setProblem({ ...problem, [name]: value })

  const handleDropdownChange = (e: SyntheticEvent<HTMLElement, Event>, { name, value }: DropdownProps) => problem &&
    setProblem({ ...problem, [name]: value })

  const handleTextareaChange = (value?: string) => problem && value &&
    setProblem({ ...problem, description: value })

  const handleTestChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) => problem &&
    setProblem({
      ...problem, tests: problem.tests.map((test: Test, index: number) => {
        if (name == `${index}-in`)
          test.in = value
        else if (name == `${index}-out`)
          test.out = value
        return test
      })
    })

  return (
    <>
      <h1>New Problem</h1>
      <Block size='xs-12'>
        {message?.type == 'error' ? <Message error content={message.message} /> :
          message?.type == 'success' ? <Message success content={message.message} /> : <></>}

        <Form>
          <h1>Problem Info</h1>
          <Form.Group widths='equal'>
            <Form.Field label='Problem ID' name='id' control={Input} onChange={handleChange} placeholder="Problem Id" value={problem?.id || ''} />
            <Form.Field label='Problem Name' name='name' control={Input} onChange={handleChange} placeholder="Problem Name" value={problem?.name || ''} />
            <Form.Select label='Division' name='division' fluid options={divisions} onChange={handleDropdownChange} placeholder="Division" value={problem?.division || ''} />
          </Form.Group>

          {problem.division == 'blue' ? <>
            <Form.Group widths='equal'>
              <Form.Field label='Memory Limit' name='memory_limit' control={Input} onChange={handleChange} value={problem?.memory_limit || -1} />
              <Form.Field label='CPU Time Limit' name='cpu_time_limit' control={Input} onChange={handleChange} value={problem?.cpu_time_limit || -1} />
            </Form.Group>
          </> : <></>}

          <h1>Problem Description</h1>
          <MDEditor
            value={problem?.description || ''}
            onChange={handleTextareaChange}
            height="500"
          />

          {problem.division == 'blue' ? <>

            <h1>Test Data</h1>
            <Menu>
              {problem?.tests.map((test: Test, index: number) => (
                <Menu.Item name={`${index + 1}`} key={`${index}-test-tab`} tab={index} active={activeTestItem === index} onClick={handleTestItemClick} />
              ))}
              <Menu.Menu position='right'>
                <Menu.Item onClick={handleNewTest}>New</Menu.Item>
                <Menu.Item onClick={handleDeleteTest}>Delete</Menu.Item>
              </Menu.Menu>
            </Menu>

            {
              problem?.tests.map((test: Test, index: number) => (
                <div key={`test-${index}`}>
                  {activeTestItem == index ?
                    <Form.Group widths='equal'>
                      <Form.Field label='Input' onChange={handleTestChange} control={TextArea} name={`${index}-in`} value={test.in} />
                      <Form.Field label='Answer' onChange={handleTestChange} control={TextArea} name={`${index}-out`} value={test.out} />
                    </Form.Group>
                    : <></>}
                </div>
              ))
            }

            <h1>Skeletons</h1>
            <p>Empty skeletons will be auto generated.</p> </> : <></>}
        </Form>

        <Button primary onClick={handleSubmit}>Create</Button>
      </Block>
    </>
  )
}


export default NewProblem