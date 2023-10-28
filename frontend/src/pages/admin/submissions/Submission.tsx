import { Submission as SubmissionType } from 'abacus'
import { NotFound, PageLoading, SubmissionView } from 'components'
import { AppContext } from 'context'
import config from 'environment'
import { saveAs } from 'file-saver'
import { useIsMounted, usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Submission")
  const isMounted = useIsMounted()

  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<SubmissionType>()
  const [isLoading, setLoading] = useState(true)
  const [isRerunning, setRerunning] = useState(false)
  const [isReleasing, setReleasing] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [isFlagging, setFlagging] = useState<{ [key: string]: boolean }>({})
  const [isUnFlagging, setUnFlagging] = useState<{ [key: string]: boolean }>({})
  const [isSaving, setSaving] = useState(false)

  const { user } = useContext(AppContext)

  const navigate = useNavigate()

  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!isMounted()) return

    if (response.ok) {
      setSubmission(Object.values(await response.json())[0] as SubmissionType)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmission()
  }, [])

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  const deleteSubmission = async () => {
    if (!sid) return
    if (window.confirm('Are you sure you want to delete this submission?')) {
      //if the user selects ok, then the code below runs, otherwise nothing occurs
      setDeleting(true)
      const response = await fetch(`${config.API_URL}/submissions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`
        },
        body: JSON.stringify({ sid: submission.sid })
      })
      if (response.ok) {
        window.sendNotification({
          id: sid,
          type: 'success',
          header: 'Success!',
          content: 'We deleted the submission you selected!'
        })
        navigate('/admin/submissions')
      }
      setDeleting(false)
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
    setReleasing(true)
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sid: submission.sid,
        released: true,
        status: submission.status,
        feedback: submission.feedback,
        score: submission.score
      })
    })
    if (response.ok) {
      const result = await response.json()
      setSubmission({ ...submission, released: result.released })
    }
    setReleasing(false)
  }

  const save = async () => {
    setSaving(true)

    await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    })
    setSaving(false)
  }

  const flag = async () => {
    if (!sid) return
    setFlagging({ ...isFlagging, [sid]: true })
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid, viewed: true, flagged: user?.uid })
    })

    if (response.ok) {
      setSubmission({ ...submission, viewed: true, flagged: user })
    }

    setFlagging({ ...isFlagging, [sid]: false })
  }

  const unflag = async () => {
    if (!sid) return
    setUnFlagging({ ...isUnFlagging, [sid]: true })
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid, flagged: null })
    })

    if (response.ok) {
      setSubmission({ ...submission, flagged: undefined })
    }

    setUnFlagging({ ...isUnFlagging, [sid]: false })
  }

  const download = () =>
    submission?.source &&
    submission.filename &&
    saveAs(new File([submission?.source], submission.filename, { type: 'text/plain;charset=utf-8' }))

  return (
    <Grid>
      <Button content="Back" icon="arrow left" labelPosition="left" onClick={() => navigate(-1)} />
      <Button
        disabled={isRerunning}
        loading={isRerunning}
        content="Rerun"
        icon="redo"
        labelPosition="left"
        onClick={rerun}
      />
      {submission.released ? (
        <Button icon="check" positive content="Released" labelPosition="left" />
      ) : (
        <Button
          loading={isReleasing}
          disabled={isReleasing}
          icon="right arrow"
          content="Release"
          labelPosition="left"
          onClick={release}
        />
      )}
      {submission.flagged ? (
        <Button
          loading={isUnFlagging[submission.sid]}
          disabled={isUnFlagging[submission.sid]}
          icon="warning"
          color="orange"
          content="Flagged"
          labelPosition="left"
          onClick={unflag}
        />
      ) : (
        <Button
          loading={isFlagging[submission.sid]}
          disabled={isFlagging[submission.sid]}
          icon="flag"
          content="Flag"
          labelPosition="left"
          onClick={flag}
        />
      )}
      <Button content="Download" icon="download" labelPosition="left" onClick={download} />
      <Button disabled={isSaving} loading={isSaving} content="Save" icon="save" labelPosition="left" onClick={save} />
      <Button
        disabled={isDeleting}
        loading={isDeleting}
        content="Delete"
        icon="trash"
        negative
        labelPosition="left"
        onClick={deleteSubmission}
      />

      <SubmissionView submission={submission} setSubmission={setSubmission} rerunning={isRerunning} />
    </Grid>
  )
}

export default Submission
