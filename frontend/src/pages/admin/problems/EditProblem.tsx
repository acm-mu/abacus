import { Problem } from 'abacus'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemEditor } from 'components/editor'
import { PageLoading, StatusMessage } from 'components'
import { StatusMessageType } from 'components/StatusMessage'
import { usePageTitle } from 'hooks'
import {ProblemRepository} from 'api'

const EditProblems = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Edit Problem")

  const problemRepo = new ProblemRepository()

  const { pid } = useParams<{ pid: string }>()
  const [problem, setProblem] = useState<Problem>()

  const [message, setMessage] = useState<StatusMessageType>()
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadProblem()
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {

    const response = await problemRepo.get(pid)

    if (!isMounted) return

    setProblem(response.data)
    setLoading(false)
  }

  const showMessage = (type: 'warning' | 'success' | 'error' | undefined, message: string) => {
    setMessage({ type, message })
    setTimeout(() => setMessage(undefined), 5 * 1000)
  }

  const handleSubmit = async (problem: Problem) => {
    const response = await problemRepo.update(problem.pid, problem)

    if (response.ok) {
      showMessage('success', 'Problem saved successfully!')
    } else {
      showMessage('error', response.errors)
    }
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <h1>{problem?.name}</h1>
      <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />

      <ProblemEditor problem={problem} handleSubmit={handleSubmit} />
    </>
  )
}

export default EditProblems
