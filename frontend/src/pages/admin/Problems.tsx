import React, { useState, useEffect } from 'react'
import { Table, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Block } from '../../components'
import { ProblemType } from '../../types'

const Problems = (): JSX.Element => {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    fetch('http://api.codeabac.us/v1/problems?division=blue')
      .then(res => res.json())
      .then(data => setProblems(data))
  }, [])

  return (
    <Block size='xs-12' transparent>
      <Link to="/admin/problems/new"><Button className='blue'>Create Problem</Button></Link>
      <Table celled className='gold'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing></Table.HeaderCell>
            <Table.HeaderCell>Problem Name</Table.HeaderCell>
            <Table.HeaderCell># of Tests</Table.HeaderCell>
            <Table.HeaderCell>Solved Attempts</Table.HeaderCell>
            <Table.HeaderCell>Total Attempts</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {problems.map((problem: ProblemType, index: number) => (
            <Table.Row key={index}>
              <Table.HeaderCell class="collapsing">{problem.id}</Table.HeaderCell>
              <Table.Cell><Link to={`/admin/problems/${problem.problem_id}/edit`}>{problem.problem_name}</Link></Table.Cell>
              <Table.Cell>{problem.tests.length}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Block>
  )
}

export default Problems