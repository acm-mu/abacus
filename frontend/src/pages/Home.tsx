import React, { useState, useEffect } from 'react'
import { Table, Loader, Message, Icon } from 'semantic-ui-react'
import { Countdown, Block, DivisionLabel } from 'components'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

type TeamType = {
  division: string
  team_name: string
  registration_date: string
  school_name: string
  num_of_students: number
}

const Home = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true)
  const [teams, setTeams] = useState<TeamType[]>([])
  const [isMounted, setMounted] = useState(true)

  const loadTeams = () => {
    fetch('https://mu.acm.org/api/registered_teams')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setTeams(Object.values(data))
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    loadTeams()
    const teamFetchInterval = setInterval(loadTeams, 5 * 60 * 1000)
    return () => {
      clearInterval(teamFetchInterval)
      setMounted(false)
    }
  })

  return (
    <>
      <Helmet>
        <title>Abacus</title>
      </Helmet>
      <Message icon color='green'>
        <Icon name='trophy' />
        <Message.Content>
          <Message.Header>Final Standings</Message.Header>
          Thank you to everyone who participated and congratulations to the winners! View the full standings for the Blue division <Link to={'/blue/standings'} className='banner-link'>here</Link> and the Gold division <Link to={'/gold/standings'} className='banner-link'>here</Link>.
          </Message.Content>
      </Message>
      <Countdown />
      <Block size="xs-12">
        <h1>Welcome to Abacus</h1>
        <p>
          Abacus is a remote code execution application similar to AlgoExpert. It is developed by students at Marquette
          University.
        </p>
      </Block>
      <Block size="xs-12">
        <h1>Teams</h1>
        <p>
          Take a look at our teams this year! Don&apos;t see your team?{' '}
          <a href="mailto:acm-registration@mscs.mu.edu">Let us know!</a>
        </p>
        {isLoading ? (
          <Loader active inline="centered" content="Loading..." />
        ) : (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Team Name</Table.HeaderCell>
                <Table.HeaderCell>Division</Table.HeaderCell>
                <Table.HeaderCell>School</Table.HeaderCell>
                <Table.HeaderCell># of Students</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teams
                .sort(
                  (t1: TeamType, t2: TeamType) => Date.parse(t2.registration_date) - Date.parse(t1.registration_date)
                )
                .map((team: TeamType, index: number) => (
                  <Table.Row key={`${team.team_name}-${index}`}>
                    <Table.Cell>{team.team_name}</Table.Cell>
                    <Table.Cell>
                      <DivisionLabel division={team.division} />
                    </Table.Cell>
                    <Table.Cell>{team.school_name}</Table.Cell>
                    <Table.Cell>{team.num_of_students}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </Block>
    </>
  )
}

export default Home
