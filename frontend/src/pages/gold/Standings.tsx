import React, { useContext, useEffect, useState } from 'react'
import { AppContext, SocketContext } from 'context'
import { Block, Countdown, PageLoading, StatusMessage } from 'components'
import { Problem } from 'abacus'
import config from 'environment'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../Standings.scss'
import { isThirtyMinutesBefore } from 'utils'

interface GoldStandingsUser {
  uid: string
  display_name: string
  score: number
  problems: Record<
    string,
    {
      score: number
      status: string
    }
  >
}

const Standings = (): React.JSX.Element => {
  const { user, settings } = useContext(AppContext)
  const socket = useContext(SocketContext)
  const [problems, setProblems] = useState<Problem[]>()
  const [standings, setStandings] = useState<[]>()
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)

  const loadData = async () => {
    const response = await fetch(`${config.API_URL}/standings?division=gold`)

    const data = await response.json()

    if (!isMounted) return

    setStandings(data.standings)

    const problems = Object.values(data.problems) as Problem[]
    setProblems(problems.sort((p1, p2) => p1.id.localeCompare(p2.id)))

    setLoading(false)
  }

  const statusToClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'solved'
      case 'rejected':
        return 'attempted'
      case 'pending':
        return 'pending'
      default:
        return ''
    }
  }

  socket?.on('new_submission', loadData)

  useEffect(() => {
    document.title = "Abacus | Gold Standings"
    loadData()
    return () => {
      setMounted(false)
    }
  }, [])

  if ((!settings || new Date() < settings.start_date) && settings && new Date() > settings?.practice_end_date)
    return (
      <>
        <Countdown />
        <Block center size="xs-12">
          <h1>Competition not yet started!</h1>
          <p>Standings will become available when the competition begins, and submissions start rolling in.</p>
        </Block>
      </>
    )

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

  if (isLoading) return <PageLoading />

  if (!standings || !problems)
    return <StatusMessage message={{ type: 'error', message: 'An error has occurred! Please contact support' }} />

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
        <Table celled id="gold standings">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>RK</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell collapsing>TOTAL</Table.HeaderCell>
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
            {standings.map((team: GoldStandingsUser, index) => {
              if (index == 0) rk = 1
              else if (last != team.score) rk = index + 1
              last = team.score
              return (
                <Table.Row key={team.uid}>
                  <Table.Cell collapsing>{rk}</Table.Cell>
                  <Table.Cell>{team.display_name}</Table.Cell>
                  <Table.Cell>{team.score}</Table.Cell>
                  {problems.map((problem) =>
                    team.problems[problem.pid]?.status == 'accepted' ? (
                      <Table.Cell
                        key={`${team.uid}-${index}`}
                        className={`score ${statusToClass(team.problems[problem.pid]?.status)}`}>
                        {team.problems[problem.pid]?.score}
                      </Table.Cell>
                    ) : (
                      <Table.Cell key={`${team.uid}-${index}}`}></Table.Cell>
                    )
                  )}
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
