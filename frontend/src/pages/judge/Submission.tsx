import { Submission as SubmissionType } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NotFound, PageLoading, StatusMessage, SubmissionView } from 'components'
import config from 'environment'
import { Button } from 'semantic-ui-react'
import { AppContext, SocketContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

// Functional component for viewing and interacting with a specific submission
const Submission = (): React.JSX.Element => {
  // Set the page title for the current view
  usePageTitle("Abacus | Judge Submission")

  // Contexts to get socket connection and app-wide state
  const socket = useContext(SocketContext)
  // Get submission ID from route paramters
  const { sid } = useParams<{ sid: string }>()
  // State to hold submission details
  const [submission, setSubmission] = useState<SubmissionType>()
  // State for loading status
  const [isLoading, setLoading] = useState(true)
  // State to track rerun status
  const [isRerunning, setRerunning] = useState(false)
  // State to track release status
  const [isReleasing, setReleasing] = useState(false)
  // State to track claiming status
  const [isClaiming, setClaiming] = useState<{ [key: string]: boolean }>({})
  // State for error messages
  const [error, setError] = useState<string>()
  // State to store submission queue
  const [queue, setQueue] = useState<SubmissionType[]>([])

  // Get user details from context
  const { user } = useContext(AppContext)

  // Hook to navigate between routes
  const navigate = useNavigate()

  // Function to load submission details by its ID
  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      // Authorization using stored token
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })


    if (response.ok) {
      // Update the submission state with data from the response
      setSubmission(Object.values(await response.json())[0] as SubmissionType)
    }
    // Stop loading after fetching data
    setLoading(false)
  }

  // Function to load submissions queue
  const loadQueue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsQueue`,{
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (response.ok) {
      // Get the submission queue data
      const queueData = await response.json()
      // Set the queue data to state
      setQueue(queueData)
    }
  }

  // Hook to get submission data and queue when component is mounted or 'sid' changes
  useEffect(() => {
    // Load the submission details
    loadSubmission().then(() => setLoading(false))
    // Load the queue data
    loadQueue()
    // Listen for 'update_submission' events from socket
    socket?.on('update_submission', loadSubmission)
  }, [sid]) // Dependency on 'sid' to refetch data when it changes

  // Show loading screen while fetching data
  if (isLoading) return <PageLoading />
  // Show not found page if submission doesn't exist
  if (!submission) return <NotFound />

  // Function to rerun a submission
  const rerun = async () => {
    if (!setSubmission) return
    // Start rerun process
    setRerunning(true)
    const response = await fetch(`${config.API_URL}/submissions/rerun`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submission.sid }) // Send submission ID to rerun it
    })
    if (response.ok) {
      const result = await response.json()
      if (result.submissions && submission.sid in result.submissions) {
        setSubmission({ team: submission?.team, problem: submission?.problem, ...result.submissions[submission.sid] })
      }
    } else {
      try {
        const { message } = await response.json()
        // Show error if rerun fails
        setError(message)
      } catch (_err) {
        return
      }
    }
    // Stop rerun process
    setRerunning(false)
  }

  // Function to release a submission after scoring
  const release = async () => {
    if (!setSubmission) return
    if (!submission) return
    // Start releasing process
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
    // Stop releasing process
    setReleasing(false)
  }

  // Function to claim a submission
  const claim = async (sid: string) => {
    // Set claiming status for the submission
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
      // Update submission state with the claiming info
      setSubmission({...submission, claimed: user, claimed_date: Date.now() / 1000})
      const updatedSubmission = { ...submission, claimed: user, claimed_date: Date.now() / 1000}
      // Enqueue the claimed submission
      enqueue(updatedSubmission)
      // Reload queue after claiming
      loadQueue()
    } else {
      try {
        const { message } = await response.json()
        // Show error if claiming fails
        setError(message)
      } catch (_err) {
        return
      }
    }

    // Stop claiming process
    setClaiming({ ...isClaiming, [sid]: false })
  }

  // Function to unclaim a submission
  const unclaim = async (sid: string) => {
    // Set unclaiming status
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
      // Clear claimed status
      setSubmission({ ...submission, claimed: undefined })
    } else {
      try {
        const { message } = await response.json()
        // Show error if unclaiming fails
        setError(message)
      } catch (_err) {
        return
      }
    }

    // Stop unclaiming process
    setClaiming({ ...isClaiming, [sid]: false })
  }

  // Function to download the source code of the submission
  const download = () =>
    submission?.source &&
    submission.filename &&
    saveAs(new File([submission?.source], submission.filename, { type: 'text/plain;charset=utf-8' }))
  
  // Function to enqueue a submission into the submission queue
  const enqueue = async (submission: SubmissionType) => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsEnqueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({submission}) // Send submission to enqueue
    })

    if (response.ok) {
      const queueData = await response.json()
      // Update the queue state
      setQueue(queueData)
      // Reload the queue after enqueuing
      loadQueue()
    }
  }

  // Function to dequeue a submission from the submission queue
  const dequeue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsDequeue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({sid: submission.sid}) // Send submission to dequeue
    })
    
    if(response.ok)
    {
      console.log("frontend/src/pages/judge/Submission.tsx dequeue here")
    }
  }

  // Function to refresh the page
  const refresh = () =>
    window.location.reload()

  // Function to rerun the submission and refresh the page after
  const rerun_refresh = () => {
    rerun()
    refresh()
  }

  // Function to release and dequeue the submission
  const release_dequeue = () => {
    release()
    dequeue()
  }

  // Function to claim a submission and reload the queue
  const claim_loadQueue = (sid: string) => {
    claim(sid)
    loadQueue()
  }

  /* This displays the queue in the console tab when inspecting the web site (right click on website and select inspect). 
     The queue will show everytime a submission page is loaded (when clicking on a submission ID of a submission). 
     This log will be useful as currently there is no other way to view the queue. */
  console.log("frontend/src/pages/judge/submission.tsx queue:", queue)

  // Disable rerun button if submission is not in the queue
  const isRerunDisabled = !queue.some((item) => item.sid === submission?.sid)

  // Render submission page with buttons for various actions
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
                    content="Score"
                    icon="redo"
                    labelPosition="left"
                    onClick={rerun_refresh}
                  />
                )}
                <Button
                  loading={isReleasing}
                  disabled={isReleasing || submission.claimed?.uid != user?.uid}
                  icon="right arrow"
                  content="Release"
                  labelPosition="left"
                  onClick={release_dequeue}
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
