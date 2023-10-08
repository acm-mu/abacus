import { Problem } from 'abacus'
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusMessage } from 'components'
import config from 'environment'
import { ProblemEditor } from 'components/editor'
import { StatusMessageType } from 'components/StatusMessage'

const NewProblem = (): React.JSX.Element => {
  const navigate = useNavigate()
  const [message, setMessage] = useState<StatusMessageType>()

  useEffect(() => {
    document.title = "Abacus | Admin New Problem"
  }, [])

  const handleSubmit = async (problem: Problem) => {
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
      navigate(`/admin/problems`)
    } else {
      setMessage({ type: 'error', message: body.message })
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
