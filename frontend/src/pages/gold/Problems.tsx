import React, { useState, useEffect } from 'react'
import { Table } from 'semantic-ui-react'
import { Block } from '../../components'
import { ProblemType } from '../../types'

const Problems = (): JSX.Element => {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    fetch('http://api.codeabac.us/v1/problems?division=gold')
      .then(res => res.json())
      .then(data => setProblems(data))
  }, [])

  return (
    <Block size='xs-12' transparent>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>&nsbp;</Table.HeaderCell>
            <Table.HeaderCell>Problem Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {problems.map((problem: ProblemType, index: number) => (
            <Table.Row key={index}>
              <Table.Cell collapsing>{problem.id}</Table.Cell>
              <Table.Cell>
                <a href={`/gold/problems/${problem.id}`}>{problem.problem_name}</a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Block>
  )
}

export default Problems