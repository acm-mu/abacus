import { Submission } from "abacus"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Countdown, GoldSubmission, NotFound, PageLoading } from "components"
import { Helmet } from "react-helmet"
import config from 'environment';
import { SubmissionContext } from "components/submission"

const submission = (): JSX.Element => {
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<Submission>()
  const [isMounted, setMounted] = useState(true)
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
    <Helmet> <title>Abacus | Gold Submission</title> </Helmet>
    <Countdown />
    <SubmissionContext.Provider value={{ submission }}>
      <GoldSubmission />
    </SubmissionContext.Provider>

  </>
}

export default submission