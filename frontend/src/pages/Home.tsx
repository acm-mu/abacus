import React, { useState, useEffect, useContext } from 'react'
import { Countdown, Block } from "../components";
import { Table, Button, Popup, Loader, ButtonGroup, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { TeamType } from '../types'
import config from '../environment'
import { UserContext } from '../context/user'

type SortKey = 'division' | 'team_name' | 'registration_date' | 'school_name' | 'num_of_students'

const Home = (): JSX.Element => {

  const [isLoading, setLoading] = useState<boolean>(true)
  const [teams, setTeams] = useState<TeamType[]>([])
  const [isMounted, setMounted] = useState<boolean>(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({
    key: 'registration_date',
    direction: 'ascending'
  })

  const sort = (key: SortKey) => {
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      setSortConfig({ key, direction: 'descending' })
    else
      setSortConfig({ key, direction: 'ascending' })
  }

  useEffect(() => {
    setMounted(true)
    loadTeams()
    return () => { setMounted(false) }
  }, [isMounted])

  const loadTeams = () => {
    fetch('https://mu.acm.org/api/registered_teams')
      .then(res => res.json())
      .then(data => {
        if (isMounted) { 
          setTeams(Object.values(data))
        }
      })
  }

  let color: string;

  switch(teams.division) {
    case "blue":
      color = "blue"
      break
    case "gold":
      color = "yellow"
      break
    case "eagle":
      color = "teal"
      break
    default:
      color = "grey"
      break
  }

return (
  <><Countdown />
    <Block size='xs-12'>
      <h1>Teams</h1>
      <p>Take a look at our teams this year! Don&apos;t see your team? <a href="mailto:acm-registration@mscs.mu.edu">Let us know!</a></p>
      
          {/* <Loader active inline='centered' content="Loading..." />  */}
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className='sortable' onClick={() => sort('team_name')}>Team Name</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('division')}>Division</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('school_name')}>School</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('num_of_students')}># of Students</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {teams ? teams.map((team: TeamType) => (
                  <Table.Row key={team.team_name}>
                  <Table.Cell>{team.team_name}</Table.Cell>
                  <Table.Cell>
                    <Label color={team.division}>
                      {_.capitalize(color)}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>{team.school_name}</Table.Cell>
                  <Table.Cell>{team.num_of_students}</Table.Cell>
                </Table.Row>
                )) : <></>}
            </Table.Body>
          </Table>
        
      </Block>
  </>

);

}

export default Home;
