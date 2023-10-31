import type { IProblem } from 'abacus'
import { ProblemRepository } from 'api'
import { PageLoading, StatusMessage } from 'components'
import { ProblemEditor } from 'components/editor'
import { StatusMessageType } from 'components/StatusMessage'
import { usePageTitle } from 'hooks'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EditProblems = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Edit Problem")

  const problemRepo = new ProblemRepository()

  const { pid } = useParams<{ pid: string }>()
  const [problem, setProblem] = useState<IProblem>()

  const [message, setMessage] = useState<StatusMessageType>()
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadProblem().catch(console.error)
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {
    if (!pid) return

    const response = await problemRepo.get(pid)

    if (!isMounted) return

    setProblem(response.data)
    setLoading(false)
  }

  const showMessage = (type: 'warning' | 'success' | 'error' | undefined, message: string) => {
    setMessage({ type, message })
    setTimeout(() => setMessage(undefined), 5 * 1000)
  }

  const handleSubmit = async (problem: IProblem) => {
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
