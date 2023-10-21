import type { ISubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { NotFound, PageLoading, StatusMessage, SubmissionView } from 'components'
import { AppContext, SocketContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Judge Submission")

  const submissionRepository = new SubmissionRepository()

  const socket = useContext(SocketContext)
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<ISubmission>()
  const [isLoading, setLoading] = useState(true)
  const [isRerunning, setRerunning] = useState(false)
  const [isReleasing, setReleasing] = useState(false)
  const [isClaiming, setClaiming] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string>()

  const { user } = useContext(AppContext)

  const navigate = useNavigate()

  const loadSubmission = async () => {
    const response = await submissionRepository.get(sid)

    if (response.ok) {
      setSubmission(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmission().then(() => setLoading(false))
    socket?.on('update_submission', loadSubmission)
  }, [sid])

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  const rerun = async () => {
    if (!setSubmission) return
    setRerunning(true)
    const response = await submissionRepository.rerun(submission.sid)
    if (response.ok) {
      const result = response.data
      if (result.submissions && submission.sid in result.submissions) {
        setSubmission({ team: submission?.team, problem: submission?.problem, ...result.submissions[submission.sid] })
      }
    } else {
      setError(response.errors)
    }
    setRerunning(false)
  }
  const release = async () => {
    if (!setSubmission) return
    if (!submission) return
    setReleasing(true)

    const response = await submissionRepository.update(sid, {
      feedback: submission.feedback,
      score: submission.score,
      released: true,
      claimed: undefined,
      status: submission.status
    })

    if (response.ok) {
      const result = response.data
      if (result)
        setSubmission({ ...submission, released: result.released, claimed: undefined })
    } else {
      try {
        setError(response.errors)
      } catch (_err) {
        return
      }
    }
    setReleasing(false)
  }

  const claim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })

    const response = await submissionRepository.update(sid, { claimed: user?.uid })

    if (response.ok) {
      setSubmission({ ...submission, claimed: user })
    } else {
      try {
        setError(response.errors)
      } catch (_err) {
        return
      }
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  const unclaim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })
    const response = await submissionRepository.update(sid, { claimed: null })

    if (response.ok) {
      setSubmission({ ...submission, claimed: undefined })
    } else {
      try {
        setError(response.errors)
      } catch (_err) {
        return
      }
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  const download = () =>
    submission?.source &&
    submission.filename &&
    saveAs(new File([submission?.source], submission.filename, { type: 'text/plain;charset=utf-8' }))

  return (
    <>

      {error && <StatusMessage message={{ type: 'error', message: error }} />}

      <Button content="Back" icon="arrow left" labelPosition="left" onClick={() => navigate(-1)} />

      {!submission.released ? (
        submission.claimed ? (
          <>
            {submission.claimed?.uid === user?.uid ? (
              <>
                <Button
                  content="Unclaim"
                  icon={'hand paper'}
                  onClick={() => unclaim(submission.sid)}
                  loading={isClaiming[submission.sid]}
                  disabled={isClaiming[submission.sid]}
                  labelPosition={'left'}
                />
                {submission.division == 'blue' && (
                  <Button
                    disabled={isRerunning || submission.claimed?.uid != user?.uid}
                    loading={isRerunning}
                    content="Rerun"
                    icon="redo"
                    labelPosition="left"
                    onClick={rerun}
                  />
                )}
                <Button
                  loading={isReleasing}
                  disabled={isReleasing || submission.claimed?.uid != user?.uid}
                  icon="right arrow"
                  content="Release"
                  labelPosition="left"
                  onClick={release}
                />
              </>
            ) : (
              <Button content="Claimed" icon={'lock'} disabled={true} labelPosition={'left'} />
            )}
          </>
        ) : (
          <Button
            content="Claim"
            icon={'hand rock'}
            onClick={() => claim(submission.sid)}
            loading={isClaiming[submission.sid]}
            disabled={isClaiming[submission.sid]}
            labelPosition={'left'}
          />
        )
      ) : (
        <Button icon="check" positive content="Released" labelPosition="left" />
      )}

      {submission.division == 'blue' && (
        <Button content="Download" icon="download" labelPosition="left" onClick={download} />
      )}

      <SubmissionView
        submission={submission}
        rerunning={isRerunning}
        setSubmission={!submission.released && submission.claimed?.uid == user?.uid ? setSubmission : undefined}
      />
    </>
  )
}

export default Submission
