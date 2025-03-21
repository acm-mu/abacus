import { Submission as SubmissionType } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NotFound, PageLoading, SubmissionView } from 'components'
import config from 'environment'
import { Button, Grid } from 'semantic-ui-react'
import { AppContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

// unctional component for viewing and interacting with a specific submission
const Submission = (): React.JSX.Element => {
  // Set page title
  usePageTitle("Abacus | Admin Submission")

  // Get the submission ID from URL params
  const { sid } = useParams<{ sid: string }>()
  // State to hold submission details
  const [submission, setSubmission] = useState<SubmissionType>()
  // State for loading status
  const [isLoading, setLoading] = useState(true)
  // State to track mounted status
  const [isMounted, setMounted] = useState(true)
  // State to track rerun status
  const [isRerunning, setRerunning] = useState(false)
  // State to track release status
  const [isReleasing, setReleasing] = useState(false)
  // State to track delete status
  const [isDeleting, setDeleting] = useState(false)
  // State to track flag status
  const [isFlagging, setFlagging] = useState<{ [key: string]: boolean }>({})
  // State to track unflag status
  const [isUnFlagging, setUnFlagging] = useState<{ [key: string]: boolean }>({})
  // State to track save status
  const [isSaving, setSaving] = useState(false)
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

    if (!isMounted) return

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
    loadSubmission()
    // Load the queue data
    loadQueue()
    return () => {
      setMounted(false)
    }
  }, [])

  // Show loading screen while fetching data
  if (isLoading) return <PageLoading />
  // Show not found page if submission doesn't exist
  if (!submission) return <NotFound />

  // Function to handle submission deletion
  const deleteSubmission = async () => {
    if (!sid) return
    // Confirmation dialog before deletion
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
        // Redirect to the submissions page after deletion
        navigate('/admin/submissions')
      }
      setDeleting(false)
    }
  }

  // Function to rerun a submission
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

  // Function to release the submission
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

  // Function to save submission changes
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

  // Function to flag the submission
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

  // Function to unflag the submission
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

  // Function to download the submission source code file
  const download = () =>
    submission?.source &&
    submission.filename &&
    saveAs(new File([submission?.source], submission.filename, { type: 'text/plain;charset=utf-8' }))
  
  // Function to dequeue submission
  const dequeue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/submissionsDequeue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({sid: submission.sid})
    })

    if (response.ok)
    {
      console.log("frontend/src/pages/admin/submissions/Submission.tsx dequeue here")
    }
  }
  
  // Function to dequeue and release submission
  const dequeue_release = () => {
    release()
    dequeue()
  }

  /* This displays the queue in the console tab when inspecting the web site (right click on website and select inspect). 
     The queue will show everytime a submission page is loaded (when clicking on a submission ID of a submission). 
     This log will be useful as currently there is no other way to view the queue. */
  console.log("frontend/src/pages/judge/submission.tsx queue:", queue)

  // Render submission page with buttons for various actions
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
          onClick={dequeue_release}
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
