import React, { ChangeEvent, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Menu, Button, TextArea, MenuItemProps, Message } from 'semantic-ui-react'
import Editor from '@monaco-editor/react'
import { Block } from '../../../components'
import config from '../../../environment'
import MDEditor from '@uiw/react-md-editor'
import { Problem, Skeleton, Test } from 'abacus'

interface ProblemStateProps {
  problem: {
    problem?: Problem;
    setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>
  }
}

const ProblemInfo = (props: ProblemStateProps) => {
  const { problem, setProblem } = props.problem

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (problem)
      setProblem({ ...problem, [name]: value })
  }

  return (
    <Form>
      <Form.Field label='Problem ID' name='id' control={Input} onChange={handleChange} value={problem?.id || ''} />
      <Form.Field label='Problem Name' name='name' control={Input} onChange={handleChange} value={problem?.name || ''} />
      <Form.Group widths='equal'>
        <Form.Field label='Memory Limit' name='memory_limit' control={Input} onChange={handleChange} value={problem?.memory_limit || -1} />
        <Form.Field label='CPU Time Limit' name='cpu_time_limit' control={Input} onChange={handleChange} value={problem?.cpu_time_limit || -1} />
      </Form.Group>
    </Form>
  )
}

const TestData = (props: ProblemStateProps) => {
  const { problem, setProblem } = props.problem
  const [activeTestItem, setActiveTestItem] = useState(0)

  const handleTestItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)
  const handleNewTest = () => {
    if (problem) {
      setProblem({ ...problem, tests: [...problem.tests, { in: '', out: '', include: false }] })
      setActiveTestItem(problem.tests.length)
    }
  }
  const handleDeleteTest = () => {
    if (problem) {
      setActiveTestItem(problem.tests.length - 2)
      setProblem({ ...problem, tests: problem.tests.filter((_, index: number) => index != activeTestItem) })
    }
  }

  const handleTestChange = ({ target: { name, value, style, scrollHeight } }: ChangeEvent<HTMLTextAreaElement>) => {
    style.height = `${scrollHeight}px`
    if (problem)
      setProblem({
        ...problem, tests: problem.tests?.map((test: Test, index: number) => {
          if (name == `${index}-in`)
            test.in = value
          else if (name == `${index}-out`)
            test.out = value
          return test
        })
      })
  }

  return (<Form>
    <Menu>
      {problem?.tests?.map((test: Test, index: number) => (
        <Menu.Item name={`${index + 1}`} key={`${index}-test-tab`} tab={index} active={activeTestItem === index} onClick={handleTestItemClick} />
      ))}
      <Menu.Menu position='right'>
        <Menu.Item onClick={handleNewTest}>New</Menu.Item>
        <Menu.Item onClick={handleDeleteTest}>Delete</Menu.Item>
      </Menu.Menu>
    </Menu>

    {problem?.tests?.map((test: Test, index: number) => (
      <div key={`test-${index}`}>
        {activeTestItem == index ?
          <Form.Group widths='equal'>
            <Form.Field style={{ height: '18em' }} label='Input' onChange={handleTestChange} control={TextArea} name={`${index}-in`} value={test.in} />
            <Form.Field style={{ height: '18em' }} label='Answer' onChange={handleTestChange} control={TextArea} name={`${index}-out`} value={test.out} />
          </Form.Group>
          : <></>}
      </div>
    ))}
  </Form>)
}

const Description = (props: ProblemStateProps) => {
  const { problem, setProblem } = props.problem

  const handleTextareaChange = (value: string | undefined) => {
    if (problem && value)
      setProblem({ ...problem, description: value })
  }

  return <MDEditor
    value={problem?.description || ''}
    onChange={handleTextareaChange}
    height="500"
  />

}

const Skeletons = (props: ProblemStateProps) => {
  const { problem, setProblem } = props.problem

  const [activeSkeleton, setActiveSkeleton] = useState('python')
  const handleSkeletonClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveSkeleton(data.tab)

  const handleSkeletonChange = (language: string, value?: string) => {
    if (problem && value)
      setProblem({
        ...problem, skeletons: problem.skeletons?.map((skeleton: Skeleton) => {
          if (language == skeleton.language)
            skeleton.source = value
          return skeleton
        })
      })
  }

  return (<>
    <Menu>
      {problem?.skeletons?.map((skeleton: Skeleton, index: number) => (
        <Menu.Item key={`skeleton-${index}`} name={skeleton.language} tab={skeleton.language} active={activeSkeleton == skeleton.language} onClick={handleSkeletonClick} />
      ))}
    </Menu>
    {problem?.skeletons?.map((skeleton: Skeleton, index: number) => (
      <div key={`editor=${index}`}>
        {skeleton.language == activeSkeleton ?
          <Editor
            key={`editor-${index}`}
            language={skeleton.language}
            width="100%"
            height="500px"
            theme="vs"
            value={skeleton.source}
            options={{ minimap: { enabled: false } }}
            onChange={(value?: string) => handleSkeletonChange(skeleton.language, value)}
          />
          : <></>}
      </div>
    ))}
  </>)
}

const EditProblems = (): JSX.Element => {
  const { pid } = useParams<{ pid: string }>()
  const [problem, setProblem] = useState<Problem>()

  const [activeItem, setActiveItem] = useState<string>('problem-info')
  const handleItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)

  const [message, setMessage] = useState<{ type: string, message: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?pid=${pid}&columns=description,skeletons,tests`, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setProblem(data)
      })
  }, [])

  const handleSubmit = async () => {
    const response = await fetch(`${config.API_URL}/problems`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify(problem)
    })
    if (response.ok) {
      setMessage({ type: 'success', message: "Problem saved successfully!" })
    } else {
      const body = await response.json()
      setMessage({ type: 'error', message: body.message })
    }
  }

  return (<>
    <h1>{problem?.name}</h1>

    <Menu attached='top' tabular>
      <Menu.Item name='Problem Info' tab='problem-info' active={activeItem === 'problem-info'} onClick={handleItemClick} />
      <Menu.Item name='Test Data' tab='test-data' active={activeItem === 'test-data'} onClick={handleItemClick} />
      <Menu.Item name='Description' tab='description' active={activeItem === 'description'} onClick={handleItemClick} />
      <Menu.Item name='Skeletons' tab='skeletons' active={activeItem === 'skeletons'} onClick={handleItemClick} />
    </Menu>

    <Block size='xs-12' style={{ padding: '20px', background: 'white', border: '1px solid #d4d4d5', borderTop: 'none' }}>
      {message?.type == 'error' ? <Message error content={message.message} /> :
        message?.type == 'success' ? <Message success content={message.message} /> : <></>}

      {activeItem == 'problem-info' ? <ProblemInfo problem={{ problem, setProblem }} /> :
        activeItem == 'test-data' ? <TestData problem={{ problem, setProblem }} /> :
          activeItem == 'description' ? <Description problem={{ problem, setProblem }} /> :
            activeItem == 'skeletons' ? <Skeletons problem={{ problem, setProblem }} /> : <></>}

      <Button primary onClick={handleSubmit}>Save</Button>
    </Block>
  </>)
}

export default EditProblems