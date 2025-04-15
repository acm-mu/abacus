import { Submission } from 'abacus'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext, SocketContext } from 'context'
import { Block, PageLoading } from 'components'
import config from 'environment'
import moment from 'moment'
import { Table, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { usePageTitle } from 'hooks'

// Main Admin Home Component
const Home = (): React.JSX.Element => {
  // Set the page title
  usePageTitle("Abacus | Admin")

  // Using socket context for real-time updates
  const socket = useContext(SocketContext)
  // Track loading state
  const [isLoading, setLoading] = useState(true)
  // Store the submissions list
  const [submissions, setSubmissions] = useState<Submission[]>()
  // Track component mounted status
  const [isMounted, setMounted] = useState(true)

  // Access the user and settings context to retrieve current user data and setting data
  const { user, settings } = useContext(AppContext)

  // Function to load submissions from API and filter the submissions
  const loadSubmissions = async () => {
    const getSubmissions = await fetch(`${config.API_URL}/submissions`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!isMounted) return

    const subs: Submission[] = Object.values(await getSubmissions.json())
    setSubmissions(
      subs.filter(
        ({ team, date }) =>
          team &&
          !team.disabled &&
          date * 1000 > Number(settings?.start_date) &&
          date * 1000 < Number(settings?.end_date)
      )
    )
    setLoading(false)
  }

  // Function that clears the queue and doubly linked list
  const clearQueue = async () => {
    const response = await fetch(`${config.API_URL}/submissions/clearQueueAndDoublyLinkedList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
    })

    if (response.ok) {
      console.log("Queue has been cleared")
    }
  }

  // Effect hook to load submissions on component mount and set up socket listeners for real-time updates
  useEffect(() => {
    loadSubmissions().then(() => setLoading(false))
    socket?.on('new_submission', loadSubmissions)
    socket?.on('update_submission', loadSubmissions)
    socket?.on('delete_submission', loadSubmissions)
    return () => setMounted(false)
  }, [])

  // Filter only flagged submissions
  const flaggedSubmissions = useMemo(() => submissions?.filter(({ flagged }) => flagged !== undefined), [submissions])

  // Generate time slot categories from start to end time
  const categories: string[] = []
  if (settings?.start_date && settings?.end_date) {
    for (let time = Number(settings?.start_date); time <= Number(settings?.end_date); time += 1800000) {
      categories.push(moment(time).format('hh:mm a'))
    }
  }

  /* TODO: These went with the PieChart component in @toast-ui/react-chart, we need to find an alternative.
   const breakdownData = useMemo(() => {
    const statuses: { [key: string]: { name: string, data: number } } = {};

    if (submissions) {
      for (const { status } of submissions) {
        if (statuses[status] == undefined)
          statuses[status] = { name: status, data: 1 }
        else
          statuses[status].data++
      }
    }

    return {
      categories: ['Submission Status'],
      series: Object.values(statuses)
    }
  }, [submissions])
  const breakdownOptions = {
    theme: {
      series: {
        colors: ['#83cd64', '#db2828', '#cccccc', '#aaaaaa']
      }
    },
    chart: {
      width: 'vw',
      height: 450,
      animation: true
    },
    series: {
      selectable: true,
      clockwise: true,
      dataLabels: {
        visible: true,
        anchor: 'outer',
      }
    },
    legend: {
      align: 'bottom',
    }
  };
  */

  // Show loading page until data is ready
  if (isLoading) return <PageLoading />

  // Main UI rendering
  return (
    <>
      <Block size="xs-12">
        <div style={{ position: 'relative' }}> 
          <h1 style={{ marginBottom: 0 }}>Admin Dashboard</h1>
          <Button
            color="red"
            content="Clear Queue"
            onClick={ clearQueue }
            style={{
              position: 'absolute',
              top: 0,
              right: 0
            }}
          >
          </Button>
        </div>
      </Block>

      <Block size="xs-6">
        <h1>Submission Breakdown</h1>
        {submissions?.length ? <p>There are submissions!</p> : <p>There are not any submissions yet!</p>}
      </Block>

      <Block size="xs-6">
        <h1>Flagged Submissions</h1>
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
            {flaggedSubmissions && flaggedSubmissions.length > 0 ? (
              flaggedSubmissions.map((submission) => (
                <Table.Row key={`flagged-${submission.sid}`}>
                  <Table.Cell>
                    <Link to={`/${user?.role}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/teams/${submission.tid}`}>{submission.team.display_name}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/problems/${submission.pid}`}>{submission.problem.name}</Link>
                  </Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={'100%'}>There are no flagged submissions.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}
export default Home
