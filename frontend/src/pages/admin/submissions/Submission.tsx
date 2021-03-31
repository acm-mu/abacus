import { Submission } from 'abacus'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { BlueSubmission, GoldSubmission, NotFound, PageLoading } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { Button } from 'semantic-ui-react'
import SubmissionContext from 'components/submission/SubmissionContext'

const submission = (): JSX.Element => {
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<Submission>()
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [rerunning, setRerunning] = useState(false)
  const [releaseLoading, setReleaseLoading] = useState(false)

  const history = useHistory()

  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!isMounted) return

    if (response.ok) {
      setSubmission(Object.values(await response.json())[0] as Submission)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmission()
    return () => { setMounted(false) }
  }, [])


  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  const deleteSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submission.sid })
    })
    if (response.ok) {
      history.push("/admin/submissions")
    }
  }

  const rerun = async () => {
    if (!setSubmission) return
    setRerunning(true)
    const response = await fetch(`${config.API_URL}/submissions/rerun`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submission.sid })
    })
    if (response.ok) {
      const result = await response.json()
      if (result.submissions && submission.sid in result.submissions) {
        setSubmission({ team: submission?.team, problem: submission?.problem, ...result.submissions[submission.sid] })
      }
    }
    setRerunning(false)
  }
  const release = async () => {
    if (!setSubmission) return
    if (!submission) return
    setReleaseLoading(true)
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sid: submission.sid, released: true })
    })
    if (response.ok) {
      const result = await response.json()
      setSubmission({ ...submission, released: result.released })
    }
    setReleaseLoading(false)
  }

  const download = () => submission?.source && submission.filename &&
    saveAs(new File([submission?.source], submission.filename, { type: 'text/plain;charset=utf-8' }))


  return <>
    <Helmet> <title>Abacus | Admin Submission</title> </Helmet>

    <Button disabled={rerunning} loading={rerunning} content="Rerun" icon="redo" labelPosition="left" onClick={rerun} />

    {submission.released ?
      <Button icon="check" positive content="Released" labelPosition="left" /> :
      <Button loading={releaseLoading} disabled={releaseLoading} icon="right arrow" content="Release" labelPosition="left" onClick={release} />}
    <Button content="Download" icon="download" labelPosition="left" onClick={download} />
    <Button content="Delete" icon="trash" negative labelPosition="left" onClick={deleteSubmission} />

    <SubmissionContext.Provider value={{ submission, rerunning }}>
      {submission.division == 'blue' && <BlueSubmission />}
      {submission.division == 'gold' && <GoldSubmission />}
    </SubmissionContext.Provider>
  </>
}

export default submission