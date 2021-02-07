import React, { useState, useEffect } from 'react'
import { Table, Button, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Block } from '../../components'
import { ProblemType, SubmissionType } from '../../types'
import config from '../../environment'

const Problems = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState([])
  const [submissions, setSubmissions] = useState<{ [key: string]: SubmissionType[] }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=blue`)
      .then(res => res.json())
      .then(probs => {
        probs = Object.values(probs)
        probs.sort((a: ProblemType, b: ProblemType) => a.id.localeCompare(b.id))
        setProblems(probs)
        setLoading(false)
      })

    fetch(`${config.API_URL}/submissions?division=blue`)
      .then(res => res.json())
      .then(data => {
        const submissions: SubmissionType[] = Object.values(data)
        const subs: { [key: string]: SubmissionType[] } = {}
        submissions.forEach((sub: SubmissionType) => {
          const { problem_id } = sub;
          if (!(problem_id in subs)) subs[problem_id] = []
          subs[problem_id].push(sub)
        })
        setSubmissions(subs)
      })
  }, [])

  return (
    <Block size='xs-12' transparent>
      <Link to="/admin/problems/new"><Button className='blue'>Create Problem</Button></Link>
      {isLoading ?
        <Loader active inline='centered' content="Loading" /> :
        <Table celled className='blue'>
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
                {submissions &&
                  <>
                    <Table.Cell>{submissions[problem.problem_id].filter((p) => p.score > 0).length}</Table.Cell>
                    <Table.Cell>{submissions[problem.problem_id].length}</Table.Cell>
                  </>
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      }
    </Block>
  )
}

export default Problems