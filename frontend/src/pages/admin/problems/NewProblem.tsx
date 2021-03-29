import { Problem } from 'abacus'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { StatusMessage } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { ProblemEditor } from 'components/editor'

const NewProblem = (): JSX.Element => {
  const history = useHistory()
  const [message, setMessage] = useState<{ type: 'success' | 'warning' | 'error' | undefined, message: string }>()

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
      history.push(`/admin/problems`)
    } else {
      setMessage({ type: 'error', message: body.message })
    }
  }

  return <>
    <Helmet>
      <title>Abacus | Admin New Problem</title>
    </Helmet>
    <h1>New Problem</h1>
    {message ? <StatusMessage message={message} onDismiss={() => setMessage(undefined)} /> : <></>}

    <ProblemEditor handleSubmit={handleSubmit} />
  </>
}


export default NewProblem