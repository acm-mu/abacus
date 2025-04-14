import { Block, PageLoading, Unauthorized } from 'components'
import { AppContext, SocketContext } from 'context'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Table } from 'semantic-ui-react'
import config from 'environment'
import { Submission } from 'abacus'
import { Link } from 'react-router-dom'
import { usePageTitle } from 'hooks'

// Functional component for viewing and interacting with the home page for judges
const Home = (): React.JSX.Element => {
  // Set the page title for the current view
  usePageTitle("Abacus | Judging Dashboard")
  // Get user details from context
  const { user } = useContext(AppContext)
  // Contexts to get socket connection and app-wide state
  const socket = useContext(SocketContext)
  // State for loading status
  const [isLoading, setLoading] = useState(true)
  // State for mounting status
  const [isMounted, setMounted] = useState(true)
  // State for submisssions
  const [submissions, setSubmissions] = useState<Submission[]>()
  // State for doubly linked list
  const [doublyLinkedList, setDoublyLinkedList] = useState<Submission[]>()

  // Memoized filtered and sorted lists of submissions
  const pendingSubmissions = useMemo(
    () => submissions?.filter(({ released, claimed }) => !released && !claimed).sort((p1, p2) => p1.date - p2.date),
    [submissions]
  )
  const myClaimedSubmissions = useMemo(
    () =>
      submissions
        ?.filter(({ released, claimed }) => !released && claimed?.uid == user?.uid)
        .sort((p1, p2) => p1.date - p2.date),
    [submissions]
  )

  // Function to load submissions
  const loadData = async () => {
    const response = await fetch(`${config.API_URL}/submissions`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!isMounted) return

    if (response.ok) {
      const data = await response.json()
      const submissions = Object.values(data) as Submission[]
      setSubmissions(submissions.filter((submission) => !submission.team.disabled))
    }
  }

  // Function to load the content of the doubly linked list
  const loadDoublyLinkedList = async () => { 
    const response = await fetch(`${config.API_URL}/submissions/submissionsDoublyLinkedList`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!isMounted) return

    if (response.ok) {
      const data = await response.json()
      const doublyLinkedListSubmissions = Object.values(data) as Submission[]
      setDoublyLinkedList(doublyLinkedListSubmissions.filter((submission) => !submission.team.disabled))
    }
  }

  // Hook to get submission data and doubly linked list when component is mounted
  useEffect(() => {
    // Load the submissions
    loadData().then(() => setLoading(false))
    // Load the submissions from the doubly linked list
    loadDoublyLinkedList()
    // Listen for 'new_submission' events from socket
    socket?.on('new_submission', loadData)
    // Listen for 'update_submission' events from socket
    socket?.on('update_submission', loadData)
    // Listen for 'update_doubly_linked_list' events from socket
    socket?.on('update_doubly_linked_list', loadDoublyLinkedList)
    return () => {
      setMounted(false)
    }
  }, [])

  /* This displays the doubly linked list in the console tab when inspecting the web site (right click on website and select inspect). 
     The doubly linked list will show everytime the home page is loaded. */
  console.log("/frontend/src/pages/judge/Home.tsx doublyLL data", doublyLinkedList)

  // Show loading screen while fetching data
  if (isLoading) return <PageLoading />
  // If the user is not authenticated, show unauthorized page
  if (!user) return <Unauthorized />

  // Render home page with tables
  if (user.division === 'blue') {
    return (
      <>
        <Block transparent size="xs-6">
          <h1>
            <Link to="/judge/submissions?filter=my_claimed">My Claimed Submissions</Link>
          </h1>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell content="Submission" />
                <Table.HeaderCell content="User" />
                <Table.HeaderCell content="Problem" />
                <Table.HeaderCell content="Language" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {myClaimedSubmissions && myClaimedSubmissions.length > 0 ? (
                myClaimedSubmissions.slice(0, 5).map((submission) => {
                  return (
                    <Table.Row key={`my-claimed-${submission.sid}`}>
                      <Table.Cell>
                        <Link to={`/judge/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/problems/${submission.pid}`}>{submission.problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{submission.language}</Table.Cell>
                    </Table.Row>
                  )
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Block>

        <Block transparent size="xs-6">
          <h1>
            <Link to="/judge/submissions?filter=pending">Unclaimed Submissions</Link>
          </h1>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell content="Submission" />
                <Table.HeaderCell content="User" />
                <Table.HeaderCell content="Problem" />
                <Table.HeaderCell content="Language" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {pendingSubmissions && pendingSubmissions.length > 0 ? (
                pendingSubmissions.slice(0, 5).map((submission) => {
                  return (
                    <Table.Row key={`pending-${submission.sid}`}>
                      <Table.Cell>
                        <Link to={`/judge/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/problems/${submission.pid}`}>{submission.problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{submission.language}</Table.Cell>
                    </Table.Row>
                  )
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Block>

        <Block transparent size="xs-12">
          <h1>
            <span>Submissions Next in Queue</span>
          </h1>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell content="Position" />
                <Table.HeaderCell content="Submission" />
                <Table.HeaderCell content="User" />
                <Table.HeaderCell content="Problem" />
                <Table.HeaderCell content="Claimer" />
                <Table.HeaderCell content="Language" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {doublyLinkedList && doublyLinkedList.length > 0 ? (
                doublyLinkedList.slice(0, 5).map((submission, index) => {
                  const position = index === 0 ? "Up Next" : (index + 1).toString()
                  return (
                    <Table.Row key={`claimed-${submission.sid}`}>
                      <Table.Cell>{position}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/problems/${submission.pid}`}>{submission.problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{submission.claimed?.display_name}</Table.Cell>
                      <Table.Cell>{submission.language}</Table.Cell>
                    </Table.Row>
                  )
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Block>
      </>
    )
  }

  if (user.division === 'gold') {
    return (
      <>
        <Block transparent size="xs-6">
          <h1>
            <Link to="/judge/submissions?filter=my_claimed">My Claimed Submissions</Link>
          </h1>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell content="Submission" />
                <Table.HeaderCell content="User" />
                <Table.HeaderCell content="Problem" />
                <Table.HeaderCell content="Language" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {myClaimedSubmissions && myClaimedSubmissions.length > 0 ? (
                myClaimedSubmissions.slice(0, 5).map((submission) => {
                  return (
                    <Table.Row key={`my-claimed-${submission.sid}`}>
                      <Table.Cell>
                        <Link to={`/judge/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/problems/${submission.pid}`}>{submission.problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{submission.language}</Table.Cell>
                    </Table.Row>
                  )
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Block>

        <Block transparent size="xs-6">
          <h1>
            <Link to="/judge/submissions?filter=pending">Unclaimed Submissions</Link>
          </h1>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell content="Submission" />
                <Table.HeaderCell content="User" />
                <Table.HeaderCell content="Problem" />
                <Table.HeaderCell content="Language" />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {pendingSubmissions && pendingSubmissions.length > 0 ? (
                pendingSubmissions.slice(0, 5).map((submission) => {
                  return (
                    <Table.Row key={`pending-${submission.sid}`}>
                      <Table.Cell>
                        <Link to={`/judge/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/judge/problems/${submission.pid}`}>{submission.problem.name}</Link>
                      </Table.Cell>
                      <Table.Cell>{submission.language}</Table.Cell>
                    </Table.Row>
                  )
                })
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Block>
      </>
    )
  }

  return (
    <Block transparent size="xs-12">
      <h1>Welcome Judge</h1>
      <p>Division is not recognized.</p>
    </Block>
  )
}

export default Home
