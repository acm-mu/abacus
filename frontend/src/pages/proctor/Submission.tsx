import type { ISubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { NotFound, PageLoading, SubmissionView } from 'components'
import { AppContext, SocketContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Judge Submission")

  const socket = useContext(SocketContext)
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<ISubmission>()
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [isViewing, setViewing] = useState(false)
  const [isFlagging, setFlagging] = useState<{ [key: string]: boolean }>({})
  const [isUnFlagging, setUnFlagging] = useState<{ [key: string]: boolean }>({})

  const { user } = useContext(AppContext)

  const navigate = useNavigate()

  const loadSubmission = async () => {
    if (!sid) {
      setLoading(false)
      return
    }

    const submissionRepo = new SubmissionRepository()
    const response = await submissionRepo.get(sid)

    if (!isMounted) return

    if (response.ok) {
      setSubmission(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmission().then(() => setLoading(false))
    socket?.on('update_submission', loadSubmission)
    return () => {
      setMounted(false)
    }
  }, [])

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  const view = async () => {
    if (!sid) return
    setViewing(true)

    const submissionsRepo = new SubmissionRepository()
    const response = await submissionsRepo.update(sid, { viewed: true })

    if (response.ok) {
      setSubmission({ ...submission, viewed: true })
    }

    setViewing(false)
  }

  const flag = async () => {
    if (!sid) return

    const submissionRepo = new SubmissionRepository()
    const response = await submissionRepo.update(sid, { viewed: true, flagged: user?.uid })

    setFlagging({ ...isFlagging, [sid]: true })

    if (response.ok) {
      setSubmission({ ...submission, viewed: true, flagged: user })
    }

    setFlagging({ ...isFlagging, [sid]: false })
  }

  const unflag = async () => {
    if (!sid) return
    setUnFlagging({ ...isUnFlagging, [sid]: true })

    const submissionRepo = new SubmissionRepository()
    const response = await submissionRepo.update(sid, { flagged: undefined })

    if (response.ok) {
      setSubmission({ ...submission, flagged: undefined })
    }

    setUnFlagging({ ...isUnFlagging, [sid]: false })
  }

  return (
    <>
      <Button content="Back" icon="arrow left" labelPosition="left" onClick={() => navigate(-1)} />
      {submission.viewed ? (
        <Button content="Viewed" icon="check" disabled={true} labelPosition={'left'} />
      ) : (
        <Button
          content="Mark as Viewed"
          icon="eye"
          onClick={view}
          loading={isViewing}
          disabled={isViewing}
          labelPosition={'left'}
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

      <SubmissionView submission={submission} />
    </>
  )
}

export default Submission
