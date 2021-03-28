import { Problem } from 'abacus'
import React, { MouseEvent, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Menu, Button, MenuItemProps, Message, Loader } from 'semantic-ui-react'
import { Block } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { EditDescription, EditProblemInfo, EditSkeletons, EditSolutions, EditTestData } from 'components/editproblem'

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

      {(() => {
        switch (activeItem) {
          case 'problem-info': return <EditProblemInfo problem={problem} setProblem={setProblem} />
          case 'test-data': return <EditTestData problem={problem} setProblem={setProblem} />
          case 'description': return <EditDescription problem={problem} setProblem={setProblem} />
          case 'skeletons': return <EditSkeletons problem={problem} setProblem={setProblem} />
          case 'solutions': return <EditSolutions problem={problem} setProblem={setProblem} />
          default: return <></>
        }
      })()}

      <Button primary onClick={handleSubmit}>Save</Button>
    </Block>
  </>
}

export default EditProblems