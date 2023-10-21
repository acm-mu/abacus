import type { IProblem } from 'abacus'
import { ProblemRepository } from 'api'
import { StatusMessage } from 'components'
import { ProblemEditor } from 'components/editor'
import { StatusMessageType } from 'components/StatusMessage'
import { usePageTitle } from 'hooks'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NewProblem = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin New Problem")

  const navigate = useNavigate()
  const [message, setMessage] = useState<StatusMessageType>()

  const handleSubmit = async (problem: IProblem) => {
    const problems = new ProblemRepository()
    const response = await problems.create(problem)

    if (response.ok) {
      navigate(`/admin/problems`)
    } else {
      setMessage({ type: 'error', message: response.errors })
    }
  }

  return (
    <>
      <h1>New Problem</h1>
      <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />
      <ProblemEditor handleSubmit={handleSubmit} />
    </>
  )
}

export default NewProblem
