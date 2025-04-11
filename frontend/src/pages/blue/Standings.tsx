import { Problem, StandingsUser } from 'abacus'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Block, Countdown, PageLoading, StatusMessage } from 'components'
import config from 'environment'
import '../Standings.scss'
import { AppContext, SocketContext } from 'context'
import { isThirtyMinutesBefore } from 'utils'
import { usePageTitle } from 'hooks'

// Functional component for viewing and interacting with the standings
const Standings = (): React.JSX.Element => {
  // Set the page title for the current view
  usePageTitle("Abacus | Blue Standings")

  // Get user details from context
  const { user, settings } = useContext(AppContext)
  // Contexts to get socket connection and app-wide state
  const socket = useContext(SocketContext)
  // State to hold problems
  const [problems, setProblems] = useState<Problem[]>()
  // State to hold standings
  const [standings, setStandings] = useState<StandingsUser[]>()
  // State for loading status
  const [isLoading, setLoading] = useState(true)
  // State to track mounting status
  const [isMounted, setMounted] = useState(true)

  // Function to load standings
  const loadData = async () => {
    const response = await fetch(`${config.API_URL}/standings?division=blue`)

    const data = await response.json()

    if (!isMounted) return

    setStandings(data.standings)

    if (data.problems) {
      const problems = Object.values(data.problems) as Problem[]
      setProblems(problems.sort((p1, p2) => p1.id.localeCompare(p2.id)))
    }

    setLoading(false)
  }
  
  // Listen for 'new_submission' events from socket
  socket?.on('new_submission', loadData)

  // Hook to get standings data when component is mounted
  useEffect(() => {
    loadData()
    return () => {
      setMounted(false)
    }
  }, [])

  // Render standing page
  if (!settings || new Date() < settings.practice_start_date)
    return (
      <>
        <Countdown />
        <Block size="xs-12">
          <h1>Competition not yet started!</h1>
          <p>Standings will become available when the competition begins, and submissions start rolling in.</p>
        </Block>
      </>
    )

  if (isLoading) return <PageLoading />

  if (!standings || !problems)
    return <StatusMessage message={{ type: 'error', message: 'An error has occurred! Please contact support' }} />

  if (settings && ((!user || user && user.role === 'team') && isThirtyMinutesBefore(settings.end_date)))
    return (
      <>
        <Countdown />
        <Block size="xs-12">
          <h1>Competition almost finished!</h1>
          <p>Scoreboard is disabled for the remainder of the competition.</p>
        </Block>
      </>
    )

  let rk = 0
  let last = 0

  return (
    <>
      <Countdown />
      <Block size="xs-12" transparent>
        <div className="table-legend">
          <div>
            <span className="legend-solved legend-status"></span>
            <p className="legend-label">Full score</p>
          </div>
          <div>
            <span className="legend-attempted legend-status"></span>
            <p className="legend-label">Attempted problem</p>
          </div>
          <div>
            <span className="legend-pending legend-status"></span>
            <p className="legend-label">Pending judgement</p>
          </div>
        </div>
      </Block>

      <Block transparent size="xs-12">
        <Table celled id={'standings'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>RK</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell collapsing>SLV.</Table.HeaderCell>
              <Table.HeaderCell collapsing>TIME</Table.HeaderCell>
              {problems.map((problem) => (
                <Table.HeaderCell key={problem.id} collapsing>
                  {user?.division === 'blue' || user?.role === 'admin' ? (
                    <Link to={`/blue/problems/${problem.id}`}>{problem.id}</Link>
                  ) : (
                    problem.id
                  )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {standings.map((team, index) => {
              if (index == 0) rk = 1
              else if (last != team.time) rk = index + 1
              last = team.time
              return (
                <Table.Row
                  key={team.uid}
                  warning={team.uid == user?.uid}
                  style={{ fontWeight: team.uid == user?.uid ? 'bold' : 'normal' }}>
                  <Table.Cell collapsing>{rk}</Table.Cell>
                  <Table.Cell>{team.display_name}</Table.Cell>
                  <Table.Cell>{team.solved}</Table.Cell>
                  <Table.Cell>{team.time}</Table.Cell>
                  {Object.values(team.problems).map((problem, index) => {
                    if (problem.solved) {
                      return (
                        <Table.Cell key={`${team.uid}-${index}`} className="solved">
                          {problem.submissions.length}
                          <br />
                          <small>{problem.problem_score}</small>
                        </Table.Cell>
                      )
                    } else if (
                      problem.submissions.length &&
                      problem.submissions[problem.submissions.length - 1].status == 'pending'
                    ) {
                      return (
                        <Table.Cell key={`${team.uid}-${index}`} className="pending">
                          {problem.submissions.length}
                          <br />
                          <small>--</small>
                        </Table.Cell>
                      )
                    } else if (problem.submissions.length) {
                      return (
                        <Table.Cell key={`${team.uid}-${index}`} className="attempted">
                          {problem.submissions.length}
                          <br />
                          <small>--</small>
                        </Table.Cell>
                      )
                    } else {
                      return <Table.Cell key={`${team.uid}-${index}`}></Table.Cell>
                    }
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Standings
