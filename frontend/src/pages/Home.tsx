import React, { useState, useEffect } from 'react'
import { Table, Loader, Message, Icon } from 'semantic-ui-react'
import { Countdown, Block, DivisionLabel } from 'components'
import { Link } from 'react-router-dom'
import {Button} from 'semantic-ui-react'

type TeamType = {
  division: string
  team_name: string
  registration_date: string
  school_name: string
  num_of_students: number
}

const Home = (): React.JSX.Element => {
  const [isLoading, setLoading] = useState(true)
  const [teams, setTeams] = useState<TeamType[]>([])
  const [isMounted, setMounted] = useState(true)
 
  const [currentPage, setCurrentPage] = useState<number>(1)
  const ITEMS_PER_PAGE = 25 
  
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
  }, [] )

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTeams = teams.slice(startIndex, endIndex); 

  return (
    <>
      <Message icon color="green">
        <Icon name="trophy" />
        <Message.Content>
          <Message.Header>Final Standings</Message.Header>
          Thank you to everyone who participated and congratulations to the winners! View the full standings for the Blue division <Link to={'/blue/standings'} className="banner-link">here</Link> and the Gold division <Link to={'/gold/standings'} className="banner-link">here</Link>.
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
            {/* Render only paginated teams */}
            {paginatedTeams.length > 0 ? (
              <Table.Body>
                {paginatedTeams
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
            ) : (
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan="4" textAlign="center">
                    No teams to display
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
        )}
        <Block size="xs-12">
          {/* Pagination controls */}
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Go to the previous page
            disabled={currentPage === 1} // Disable if already on the first page
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(teams.length / ITEMS_PER_PAGE)) // Go to the next page, preventing going beyond the last page
              )
            }
            disabled={currentPage === Math.ceil(teams.length / ITEMS_PER_PAGE)} // Disable if on the last page
          >
            Next
          </Button>
        </Block>
      </Block>
    </>
  );
};

export default Home;
