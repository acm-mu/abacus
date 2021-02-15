import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Menu, Button, TextArea, MenuItemProps, Message } from 'semantic-ui-react'
import { ProblemType, TestType } from '../../types'
import { Block } from '../../components'
import config from '../../environment'
import MarkdownView from 'react-showdown'

const EditProblems = (): JSX.Element => {
  const [problem, setProblem] = useState<ProblemType>()

  const [activeItem, setActiveItem] = useState<string>('problem-info')
  const handleItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)

  const [message, setMessage] = useState<{ type: string, message: string }>()
  const { problem_id } = useParams<{ problem_id: string }>()

  const [activeTestItem, setActiveTestItem] = useState(0)
  const handleTestItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)
  const handleNewTest = () => {
    if (problem) {
      setProblem({ ...problem, tests: [...problem.tests, { in: '', out: '', result: '' }] })
      setActiveTestItem(problem.tests.length)
    }
  }
  const handleDeleteTest = () => {
    if (problem) {
      setActiveTestItem(problem.tests.length - 2)
      setProblem({ ...problem, tests: problem.tests.filter((_, index: number) => index != activeTestItem) })
    }
  }

  useEffect(() => {
    fetch(`${config.API_URL}/problems?problem_id=${problem_id}`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setProblem(data)
      })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (problem)
      setProblem({ ...problem, [name]: value })
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target
    event.target.style.height = `${event.target.scrollHeight}px`
    if (problem)
      setProblem({ ...problem, [name]: value })
  }

  const handleTestChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target
    event.target.style.height = `${event.target.scrollHeight}px`
    if (problem)
      setProblem({
        ...problem, tests: problem.tests.map((test: TestType, index: number) => {
          if (name == `${index}-in`)
            test.in = value
          else if (name == `${index}-out`)
            test.out = value
          return test
        })
      })
  }

  const showMessage = (type: string, message: string) => {
    setMessage({ type, message })
    setTimeout(() => {
      setMessage(undefined)
    }, 2000)
  }

  const handleSubmit = async () => {
    const res = await fetch(`${config.API_URL}/problems`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problem)
    })
    if (res.status == 200) {
      showMessage('success', "Problem saved successfully!")
    } else if (res.status == 400) {
      const body = await res.json()
      setMessage({ type: 'error', message: body.message })
    }
  }

  return (
    <>
      <h1>{problem?.problem_name}</h1>
      <Block size='xs-12' transparent>
        <Menu attached='top' tabular>
          <Menu.Item name='Problem Info' tab='problem-info' active={activeItem === 'problem-info'} onClick={handleItemClick} />
          <Menu.Item name='Test Data' tab='test-data' active={activeItem === 'test-data'} onClick={handleItemClick} />
          <Menu.Item name='Description' tab='description' active={activeItem === 'description'} onClick={handleItemClick} />
          <Menu.Item name='Sample Files' tab='sample-files' active={activeItem === 'sample-files'} onClick={handleItemClick} />
        </Menu>
        <> {message ?
          (() => {
            switch (message.type) {
              case 'error':
                return (<Message error>{message.message}</Message>)
              case 'success':
                return <Message success>{message.message}</Message>
            }
          })() : <></>} </>
        <Form style={{ padding: '20px', background: 'white', border: '1px solid #d4d4d5', borderTop: 'none' }}>
          {(() => {
            switch (activeItem) {
              case 'problem-info':
                return (<section>
                  <Form.Field label='Problem ID' name='id' control={Input} onChange={handleChange} value={problem?.id || ''} />
                  <Form.Field label='Problem Name' name='problem_name' control={Input} onChange={handleChange} value={problem?.problem_name || ''} />
                  <Form.Group widths='equal'>
                    <Form.Field label='Memory Limit' name='memory_limit' control={Input} onChange={handleChange} value={problem?.memory_limit || -1} />
                    <Form.Field label='CPU Time Limit' name='cpu_time_limit' control={Input} onChange={handleChange} value={problem?.cpu_time_limit || -1} />
                  </Form.Group>
                </section>)
              case 'test-data':
                return (<section>
                  <Menu >
                    {problem?.tests.map((test: TestType, index: number) => (
                      <Menu.Item name={`${index + 1}`} key={`${index}-test-tab`} tab={index} active={activeTestItem === index} onClick={handleTestItemClick} />
                    ))}
                    <Menu.Menu position='right'>
                      <Menu.Item onClick={handleNewTest}>New</Menu.Item>
                      <Menu.Item onClick={handleDeleteTest}>Delete</Menu.Item>
                    </Menu.Menu>
                  </Menu>

                  {problem?.tests.map((test: TestType, index: number) => (
                    <div key={`test-${index}`}>
                      {activeTestItem == index ?
                        <Form.Group widths='equal'>
                          <Form.Field label='Input' onChange={handleTestChange} control={TextArea} name={`${index}-in`} value={test.in} />
                          <Form.Field label='Answer' onChange={handleTestChange} control={TextArea} name={`${index}-out`} value={test.out} />
                        </Form.Group>
                        : <></>}
                    </div>
                  ))}
                </section>)
              case 'description':
                return (<section>
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>Problem Description</label>
                      <TextArea name='description' onChange={handleTextareaChange} value={problem?.description || ''} style={{ height: '100%', overflowY: 'hidden' }} />
                    </Form.Field>
                    <Form.Field>
                      <label>Preview</label>
                      <div className="markdown" id='preview'>
                        <MarkdownView markdown={problem?.description || ""} />
                      </div>
                    </Form.Field>
                  </Form.Group>
                </section>)
              case 'sample-files':
                return (
                  <section>
                    <h3>Sample Files</h3>
                  </section>)
            }
          })()}
          <Button primary onClick={handleSubmit}>Save</Button>
        </Form>
      </Block>
    </>
  )
}

export default EditProblems