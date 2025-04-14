import { Submission } from 'abacus'
import React, { ChangeEvent, useState, useEffect, useMemo, useContext } from 'react'
import { Button, Checkbox, Label, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import config from 'environment'
import { compare } from 'utils'
import { PageLoading } from 'components'
import { AppContext, SocketContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

interface SubmissionItem extends Submission {
  checked: boolean
}
type SortKey = 'date' | 'sid' | 'sub_no' | 'language' | 'status' | 'runtime' | 'score'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

// Functional component for viewing and interacting with multiple submissions
const Submissions = (): React.JSX.Element => {
  // Set the page title for the submissions page
  usePageTitle("Abacus | Judge Submissions")

  // Using socket context for real-time updates
  const socket = useContext(SocketContext)
  // Track loading state
  const [isLoading, setLoading] = useState(true)
  // Store the submissions list
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  // Track component mounted status
  const [isMounted, setMounted] = useState(true)
  // Track the deleting state
  const [isDeleting, setDeleting] = useState(false)
  // Track claiming state for each submission
  const [isClaiming, setClaiming] = useState<{ [key: string]: boolean }>({})
  // Flag to toggle visibility of released submissions
  const [showReleased, setShowReleased] = useState(false)
  // Get filter query parameter from URL
  const filter = new URLSearchParams(window.location.search).get('filter')
  // State to store submission queue
  const [queue, setQueue] = useState<Submission[]>([])

  // Access the user context to retrieve current user data
  const { user } = useContext(AppContext)

  // Sort configuration state management
  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  // Function to handle sorting of submissions based on column selection
  const sort = (newColumn: SortKey, submission_list: SubmissionItem[] = submissions) => {
    const newDirection = column === newColumn && direction == 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    // Sorting the list of submissions based on the column and direction
    setSubmissions(
      submission_list.sort(
        (s1: Submission, s2: Submission) =>
          compare(s1[newColumn] || 'ZZ', s2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  // Effect hook to load submissions on component mount and set up socket listeners for real-time updates
  useEffect(() => {
    loadSubmissions().then(() => setLoading(false))
    socket?.on('new_submission', loadSubmissions)
    socket?.on('update_submission', loadSubmissions)
    socket?.on('update_queue', loadQueue)
    return () => setMounted(false)
  }, [])

  // Function to load submissions from API and filter out disabled teams
  const loadSubmissions = async () => {
    const response = await fetch(`${config.API_URL}/submissions?division=${user?.division}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    const submissions = Object.values(await response.json()) as SubmissionItem[]

    if (!isMounted) return

    setSubmissions(
      submissions
        .filter((submission) => !submission.team.disabled)
        .map((submission) => ({ ...submission, checked: false }))
    )
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

  // Function to enqueue a submission to the queue
  const enqueue = async (submission: Submission) => {
      const response = await fetch(`${config.API_URL}/submissions/submissionsEnqueue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`
        },
        body: JSON.stringify({submission})
      })

      if (response.ok)
      {
        console.log("frontend/src/pages/judge/Submissions.tsx enqueue here")
      }
    }

    // Toggle filter for showing released submissions
  const onFilterChange = () => setShowReleased(!showReleased)

  // Function to download submissions as a JSON file
  const downloadSubmissions = () =>
    saveAs(new File([JSON.stringify(submissions, null, '\t')], 'submissions.json', { type: 'text/json;charset=utf-8' }))

  // Handle individual checkbox state change
  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setSubmissions(submissions.map((submission) => (submission.sid == id ? { ...submission, checked } : submission)))

  // Handle "check all" checkbox state change
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setSubmissions(submissions.map((submission) => ({ ...submission, checked })))

  // Delete selected submissions
  const deleteSelected = async () => {
    setDeleting(true)
    const submissionsToDelete = submissions
      .filter((submission) => submission.checked)
      .map((submission) => submission.sid)
    // Send request to delete selected submissions
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submissionsToDelete })
    })
    if (response.ok) {
      // Reload submissions after successful deletion
      loadSubmissions()
    }
    setDeleting(false)
  }

  // Function to claim a submission (assign it to the current user)
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
      setSubmissions(submissions.map((sub) => (sub.sid == sid ? { ...sub, claimed: user } : sub)))
      const oldSubmission = submissions.filter((sub) => sub.sid === sid)[0]
      const updatedSubmission = { ...oldSubmission, claimed: user, claimed_date: Date.now() / 1000 } as Submission
      // Enqueue the updated submission
      if (updatedSubmission.division === 'blue') {
        enqueue(updatedSubmission)
      }
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  // Function to unclaim a submission (release it from the current user)
  const unclaim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid, claimed: '', claimed_date: 0 })
    })

    if (response.ok) {
      setSubmissions(submissions.map((sub) => (sub.sid == sid ? { ...sub, claimed: undefined, claimed_date: undefined } : sub)))
      const submission = submissions.filter((sub) => sub.sid === sid)[0]
      console.log('/frontend/src/pages/judge/Submissions.tsx submission', submission)
      if (submission.division === 'blue') {
        const isInQueue = queue.some((item) => item.sid === submission?.sid)
        if (isInQueue) {
          dequeue(submission)
        }
        else {
          removeAtDoublyLinkedList(submission)
        }
      }
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  // Function to dequeue a submission from the submission queue
  const dequeue = async (submission: Submission) => {
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

  const removeAtDoublyLinkedList = async (submission: Submission) => {
    const response = await fetch(`${config.API_URL}/submissions/removeAtDoublyLinkedList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({sid: submission.sid}) // Send submission to be removed from linked list
    })
    
    if(response.ok)
    {
      console.log("frontend/src/pages/judge/Submission.tsx removed from linked list")
    }
  }

  // URL filter function for filtering based on submission status
  const urlFilter = ({ claimed }: Submission) => {
    switch (filter) {
      case 'my_claimed':
        return !showReleased && claimed?.uid == user?.uid
      case 'other_claimed':
        return !showReleased && claimed !== undefined && claimed?.uid != user?.uid
      case 'pending':
        return !showReleased && !claimed
      case 'recently_graded':
        return !showReleased
      default:
        return true
    }
  }

  // Filter list of submissions based on the selected filter and showReleased flag
  const filteredSubmissions = useMemo(
    () => submissions.filter((submission) => showReleased || (!submission.released && urlFilter(submission))),
    [submissions, showReleased, filter]
  )

  // Show loading spinner if data is still being fetched
  if (isLoading) return <PageLoading />

  return (
    <>
      <Button content="Download Submissions" onClick={downloadSubmissions} />
      {submissions.filter((submission) => submission.checked).length ? (
        <Button
          content="Delete Selected"
          negative
          onClick={deleteSelected}
          loading={isDeleting}
          disabled={isDeleting}
        />
      ) : (
        <></>
      )}
      {filter && (
        <Button as={Link} to="/judge/submissions">
          Clear Filter: <i>{filter}</i>
        </Button>
      )}
      <Checkbox toggle label="Show Released" checked={showReleased} onClick={onFilterChange} />

      <Table singleLine sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>
              <input type="checkbox" onChange={checkAll} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('sid')}
              sorted={column == 'sid' ? direction : undefined}>
              Submission ID
            </Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('language')}
              sorted={column == 'language' ? direction : undefined}>
              Language
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('status')}
              sorted={column == 'status' ? direction : undefined}>
              Status
            </Table.HeaderCell>
            <Table.HeaderCell>Claimed</Table.HeaderCell>
            <Table.HeaderCell>Released</Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('date')}
              sorted={column == 'date' ? direction : undefined}>
              Time
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('score')}
              sorted={column == 'score' ? direction : undefined}>
              Score
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredSubmissions.length == 0 ? (
            <Table.Row>
              <Table.Cell colSpan={'100%'}>No Submissions</Table.Cell>
            </Table.Row>
          ) : (
            filteredSubmissions.map((submission) => {
              return (
                <Table.Row key={submission.sid}>
                  <Table.Cell>
                    <input type="checkbox" checked={submission.checked} id={submission.sid} onChange={handleChange} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/problems/${submission.pid}`}>{submission.problem?.name} </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/teams`}>{submission.team.display_name}</Link>
                  </Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                  <Table.Cell>
                    <span className={`status icn ${submission.status}`} />
                  </Table.Cell>
                  <Table.Cell>
                    {submission.claimed ? (
                      submission.claimed?.uid === user?.uid ? (
                        <Button
                          content="Unclaim"
                          icon={'hand paper'}
                          onClick={() => unclaim(submission.sid)}
                          loading={isClaiming[submission.sid]}
                          disabled={isClaiming[submission.sid]}
                          labelPosition={'left'}
                        />
                      ) : (
                        <Button content="Claimed" icon={'lock'} disabled={true} labelPosition={'left'} />
                      )
                    ) : (
                      <Button
                        content="Claim"
                        icon={'hand rock'}
                        onClick={() => claim(submission.sid)}
                        loading={isClaiming[submission.sid]}
                        disabled={isClaiming[submission.sid]}
                        labelPosition={'left'}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {submission.released ? (
                      <Label color="green" icon="check" content="Released" />
                    ) : (
                      <Label icon="lock" content="Held" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Moment fromNow date={submission.date * 1000} />{' '}
                  </Table.Cell>
                  <Table.Cell>{submission.score}</Table.Cell>
                </Table.Row>
              )
            })
          )}
        </Table.Body>
      </Table>
    </>
  )
}

export default Submissions
