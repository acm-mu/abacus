import { Problem } from 'abacus'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { ProblemEditor } from 'components/editor'
import { Block, PageLoading, StatusMessage } from 'components'
import { StatusMessageType } from 'components/StatusMessage'
import { Button } from 'semantic-ui-react'

const EditProblems = (): JSX.Element => {
  const { pid } = useParams<{ pid: string }>()
  const [problem, setProblem] = useState<Problem>()

  const [message, setMessage] = useState<StatusMessageType>()
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)

  const history = useHistory()

  useEffect(() => {
    loadProblem()
    return () => { setMounted(false) }
  }, [])

  const loadProblem = async () => {
    const response = await fetch(`${config.API_URL}/problems?pid=${pid}&columns=description,solutions,project_id,skeletons,tests,design_document`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (!isMounted) return
    const problem = Object.values(await response.json())[0] as Problem

    setProblem(problem)
    setLoading(false)
  }

  const showMessage = (type: 'warning' | 'success' | 'error' | undefined, message: string) => {
    setMessage({ type, message })
    setTimeout(() => setMessage(undefined), 5 * 1000)
  }

  const handleSubmit = async (problem: Problem) => {
    const response = await fetch(`${config.API_URL}/problems`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify(problem)
    })
    if (response.ok) {
      showMessage('success', "Problem saved successfully!")
    } else {
      const body = await response.json()
      showMessage('error', body.message)
    }
  }

  if (isLoading) return <PageLoading />

  return <>
    <Helmet> <title>Abacus | Admin Edit Problem</title> </Helmet>

    <h1>{problem?.name}</h1>
    <Block transparent size='xs-12'>
      <Button content='Back' icon='arrow left' labelPosition='left' onClick={history.goBack} />
    </Block>
    <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />

    <ProblemEditor problem={problem} handleSubmit={handleSubmit} />
  </>
}

export default EditProblems