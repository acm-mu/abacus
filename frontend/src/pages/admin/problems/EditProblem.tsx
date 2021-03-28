import { Problem } from 'abacus'
import React, { ChangeEvent, MouseEvent, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Menu, Button, TextArea, MenuItemProps, Message, Loader, InputOnChangeData } from 'semantic-ui-react'
import Editor from '@monaco-editor/react'
import MDEditor from '@uiw/react-md-editor'
import { Block } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'

interface ProblemStateProps {
  problem?: Problem;
  setProblem: React.Dispatch<React.SetStateAction<Problem | undefined>>
}

const ProblemInfo = ({ problem, setProblem }: ProblemStateProps) => {
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

const TestData = ({ problem, setProblem }: ProblemStateProps) => {
  const [activeTestItem, setActiveTestItem] = useState(0)

  const handleTestItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)
  const handleNewTest = () => {
    if (problem) {
      setProblem({ ...problem, tests: [...problem.tests, { in: '', out: '', include: false }] })
      setActiveTestItem(problem.tests.length)
    }
  }
  const handleDeleteTest = () => {
    if (problem) {
      setActiveTestItem(problem.tests.length - 2)
      setProblem({ ...problem, tests: problem.tests.filter((_, index) => index != activeTestItem) })
    }
  }

  const handleTestChange = ({ target: { name, value, style, scrollHeight } }: ChangeEvent<HTMLTextAreaElement>) => {
    style.height = `${scrollHeight}px`
    if (problem)
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

    {problem?.tests?.map((test, index) => (
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

const Description = ({ problem, setProblem }: ProblemStateProps) => {
  const handleTextareaChange = (value: string | undefined) => {
    if (problem && value)
      setProblem({ ...problem, description: value })
  }

  return <MDEditor
    value={problem?.description || ''}
    onChange={handleTextareaChange}
    height="500" />
}

const Skeletons = ({ problem, setProblem }: ProblemStateProps) => {
  const [activeSkeleton, setActiveSkeleton] = useState('python')
  const handleSkeletonClick = (event: MouseEvent, data: MenuItemProps) => setActiveSkeleton(data.tab)

  const handleSkeletonChange = (language: string, value?: string) => {
    if (problem && value)
      setProblem({
        ...problem,
        skeletons: problem.skeletons?.map((skeleton) =>
          language == skeleton.language ? {
            ...skeleton,
            source: value
          } : skeleton
        )
      })
  }

  const handleChange = (language: string, { value: file_name }: InputOnChangeData) => {
    if (problem)
      setProblem({
        ...problem,
        skeletons: problem.skeletons?.map((skeleton) =>
          language == skeleton.language ? {
            ...skeleton,
            file_name
          } : skeleton
        )
      })
  }

  return <>
    <Menu>
      {problem?.skeletons?.map((skeleton, index) => (
        <Menu.Item key={`skeleton-${index}`} name={skeleton.language} tab={skeleton.language} active={activeSkeleton == skeleton.language} onClick={handleSkeletonClick} />
      ))}
    </Menu>
    {problem?.skeletons?.map((skeleton, index) =>
      skeleton.language == activeSkeleton ?
        <>
          <div key={`editor=${index}`} style={{ margin: '15px 0' }}>
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
          </div>
          <Input
            label='Filename'
            size='small'
            name='filename'
            value={skeleton.file_name}
            onChange={(event, data) => { handleChange(skeleton.language, data) }}
            style={{ margin: '15px' }} />
        </> : <></>
    )}
  </>
}

const Solutions = ({ problem, setProblem }: ProblemStateProps) => {
  const [activeSolution, setActiveSolution] = useState('python')
  const handleSolutionClick = (event: MouseEvent, data: MenuItemProps) => setActiveSolution(data.tab)

  const handleSolutionChange = (language: string, value?: string) => {
    if (problem && value)
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          language == solution.language ? {
            ...solution,
            source: value
          } : solution
        )
      })
  }

  const handleChange = (language: string, { value: file_name }: InputOnChangeData) => {
    if (problem)
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          language == solution.language ? {
            ...solution,
            file_name
          } : solution
        )
      })
  }

  return <>
    <Menu>
      {problem?.solutions?.map((solution, index) => (
        <Menu.Item key={`skeleton-${index}`} name={solution.language} tab={solution.language} active={activeSolution == solution.language} onClick={handleSolutionClick} />
      ))}
    </Menu>
    {problem?.solutions?.map((solution, index) =>
      solution.language == activeSolution ?
        <>
          <div key={`editor=${index}`} style={{ margin: '15px 0' }}>
            <Editor
              key={`editor-${index}`}
              language={solution.language}
              width="100%"
              height="500px"
              theme="vs"
              value={solution.source}
              options={{ minimap: { enabled: false } }}
              onChange={(value?: string) => handleSolutionChange(solution.language, value)}
            />
          </div>
          <Input
            label='Filename'
            size='small'
            name='filename'
            value={solution.file_name}
            onChange={(event, data) => { handleChange(solution.language, data) }}
            style={{ margin: '15px' }} />
        </> : <></>
    )}
  </>
}

const EditProblems = (): JSX.Element => {
  const { pid } = useParams<{ pid: string }>()
  const [problem, setProblem] = useState<Problem>()

  const [activeItem, setActiveItem] = useState<string>('problem-info')
  const handleItemClick = (event: MouseEvent, data: MenuItemProps) => {
    setMessage(undefined)
    setActiveItem(data.tab)
  }

  const [message, setMessage] = useState<{ type: string, message: string }>()
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadProblem()
    return () => { setMounted(false) }
  }, [])

  const loadProblem = async () => {
    const response = await fetch(`${config.API_URL}/problems?pid=${pid}&columns=description,solutions,skeletons,tests`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (!isMounted) return
    const problem = Object.values(await response.json())[0] as Problem

    setProblem(problem)
    setLoading(false)
  }

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

  if (isLoading) return <Loader active inline='centered' content="Loading" />

  return <>
    <Helmet>
      <title>Abacus | Admin Edit Problem</title>
    </Helmet>
    <h1>{problem?.name}</h1>

    <Menu attached='top' tabular>
      <Menu.Item name='Problem Info' tab='problem-info' active={activeItem === 'problem-info'} onClick={handleItemClick} />
      <Menu.Item name='Description' tab='description' active={activeItem === 'description'} onClick={handleItemClick} />
      {problem?.division == 'blue' ? <>
        <Menu.Item name='Test Data' tab='test-data' active={activeItem === 'test-data'} onClick={handleItemClick} />
        <Menu.Item name='Skeletons' tab='skeletons' active={activeItem === 'skeletons'} onClick={handleItemClick} />
        <Menu.Item name='Solutions' tab='solutions' active={activeItem == 'solutions'} onClick={handleItemClick} />
      </> : <></>}
    </Menu>

    <Block size='xs-12' style={{ padding: '20px', background: 'white', border: '1px solid #d4d4d5', borderTop: 'none' }}>
      {message?.type == 'error' ? <Message error content={message.message} /> :
        message?.type == 'success' ? <Message success content={message.message} /> : <></>}

      {activeItem == 'problem-info' ? <ProblemInfo problem={problem} setProblem={setProblem} /> :
        activeItem == 'test-data' ? <TestData problem={problem} setProblem={setProblem} /> :
          activeItem == 'description' ? <Description problem={problem} setProblem={setProblem} /> :
            activeItem == 'skeletons' ? <Skeletons problem={problem} setProblem={setProblem} /> :
              activeItem == 'solutions' ? <Solutions problem={problem} setProblem={setProblem} /> : <></>}

      <Button primary onClick={handleSubmit}>Save</Button>
    </Block>
  </>
}

export default EditProblems