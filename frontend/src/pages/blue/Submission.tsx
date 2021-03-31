import { Submission } from 'abacus'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BlueSubmission, Countdown, NotFound, PageLoading } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { SubmissionContext } from 'components/submission'

const submission = (): JSX.Element => {
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<Submission>()
  const [isMounted, setMounted] = useState<boolean>(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmission()
    return () => { setMounted(false) }
  }, [])

  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    if (response.ok) {
      setSubmission(Object.values(await response.json())[0] as Submission)
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  return <>
    <Helmet> <title>Abacus | Blue Submission</title> </Helmet>
    <Countdown />
    <SubmissionContext.Provider value={{ submission }}>
      <BlueSubmission />
    </SubmissionContext.Provider>
  </>
}

export default submission