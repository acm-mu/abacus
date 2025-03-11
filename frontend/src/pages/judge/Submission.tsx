import { Submission as SubmissionType } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NotFound, PageLoading, StatusMessage, SubmissionView } from 'components'
import config from 'environment'
import { Button } from 'semantic-ui-react'
import { AppContext, SocketContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Judge Submission")

  const socket = useContext(SocketContext)
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<SubmissionType>()
  const [isLoading, setLoading] = useState(true)
  const [isRerunning, setRerunning] = useState(false)
  const [isReleasing, setReleasing] = useState(false)
  const [isClaiming, setClaiming] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string>()
  const [queue, setQueue] = useState<SubmissionType[]>([])

  const { user } = useContext(AppContext)

  const navigate = useNavigate()

  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })


    if (response.ok) {
      setSubmission(Object.values(await response.json())[0] as SubmissionType)
    }
    setLoading(false)
  }

  const loadQueue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsQueue`,{
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    console.log("/frontend/src/pages/judge/Submission.tsx loadQueue response:", response)

    if (response.ok) {
      const queueData = await response.json()
      setQueue(queueData)
      console.log("frontend/src/pages/judge/Submission.tsx loadQueue here")
    }
  }

  /*
  const addToQueue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsQueue`,{
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    console.log("/frontend/src/pages/judge/Submission.tsx addToQueue response:", response)

    if (response.ok) {
      const queueData = await response.json()
      setQueue(queueData);
      console.log("frontend/src/pages/judge/Submission.tsx addToQueue here")
    }
  }
    */

  useEffect(() => {
    loadSubmission().then(() => setLoading(false))
    loadQueue()
    socket?.on('update_submission', loadSubmission)
  }, [sid])

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />

  // const loadSubmissionsQueue = async () => {
  //   const response = await fetch(`${config.API_URL}/submissions/submissionsQueue`, {
  //     headers: { Authorization: `Bearer ${localStorage.accessToken}`}
  //   })

  //   //if(response.ok)
  // }


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
    } else {
      try {
        const { message } = await response.json()
        setError(message)
      } catch (_err) {
        return
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
        feedback: submission.feedback,
        score: submission.score,
        released: true,
        released_date: Date.now() / 1000,
        claimed: undefined,
        status: submission.status
      })
    })
    if (response.ok) {
      const result = await response.json()
      setSubmission({ ...submission, released: result.released, released_date: Date.now() / 1000, claimed: undefined })
    } else {
      try {
        const { message } = await response.json()
        setError(message)
      } catch (_err) {
        return
      }
    }
    setReleasing(false)
  }

  const claim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid, claimed: user?.uid, claimed_date: Date.now() / 1000 })
    })

    if (response.ok) {
      setSubmission({...submission, claimed: user, claimed_date: Date.now() / 1000})
      const updatedSubmission = { ...submission, claimed: user, claimed_date: Date.now() / 1000}
      //setSubmission(updatedSubmission)
      enqueue(updatedSubmission)
      loadQueue()
      //addToQueue()
    } else {
      try {
        const { message } = await response.json()
        setError(message)
      } catch (_err) {
        return
      }
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  const unclaim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid, claimed: null })
    })

    if (response.ok) {
      setSubmission({ ...submission, claimed: undefined })
    } else {
      try {
        const { message } = await response.json()
        setError(message)
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
  
  const enqueue = async (submission: SubmissionType) => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsEnqueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({submission})
    })

    console.log("/frontend/src/pages/judge/Submission.tsx enqueue response:", response)

    if (response.ok) {
      //loadQueue()
      const queueData = await response.json()
      setQueue(queueData)
      loadQueue()
      console.log("frontend/src/pages/judge/Submission.tsx enqueue here")
    }
  }

  const dequeue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsDequeue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({sid: submission.sid})
    })

    console.log("/frontend/src/pages/judge/Submission.tsx dequeue response:", response)

    if (response.ok) {
      console.log("frontend/src/pages/judge/Submission.tsx dequeue here")
    }
  }

  const refresh = () =>
    window.location.reload()

  const rerun_dequeue_refresh = () => {
    rerun()
    dequeue()
    refresh()
  }

  // const claim_refresh = (sid: string) => {
  //   claim(sid)
  //   refresh()
  // }

  // function rerun_dequeue_refresh()
  // {
  //   rerun()
  //   dequeue()
  //   refresh()
  // }

  const claim_loadQueue = (sid: string) => {
    claim(sid)
    loadQueue()
  }

  console.log("frontend/src/pages/judge/submission.tsx queue:", queue)

  const isRerunDisabled = !queue.some((item) => item.sid === submission?.sid)

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
                    disabled={isRerunning || submission.claimed?.uid != user?.uid || isRerunDisabled}
                    loading={isRerunning}
                    content="Rerun"
                    icon="redo"
                    labelPosition="left"
                    onClick={rerun_dequeue_refresh}
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
            onClick={() => claim_loadQueue(submission.sid)}
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
