import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Button, Input, Table } from 'semantic-ui-react'
import { Block } from '../../components'
import { TestType } from '../../types'
import config from '../../environment'

const Submission = (): JSX.Element => {
  const { submission_id } = useParams<{ submission_id: string }>()
  const [submission, setSubmission] = useState({
    submission_id: '',
    team_name: '',
    prob_id: '',
    score: 0,
    prob_name: '',
    status: '',
    language: '',
    runtime: 0,
    tests: [],
    date: 0,
  })

  useEffect(() => {
    fetch(`${config.API_URL}/submission?submission_id=${submission_id}`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setSubmission(data)
      })
  }, [])

  return (
    <Block size='xs-12'>
      <h1>Submission</h1>
      {/* <form action="/api/submissions" method="DELETE" async onsuccess="redirect"> */}
      <Form>
        <a href="/admin/submissions/{{ submission.submission_id }}/invoke" className="ui button">Rerun</a>
        <Input style={{ display: 'none' }} value={submission.submission_id} />
        <Button color='red'>Delete</Button>
      </Form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowspan={2}>ID</Table.HeaderCell>
            <Table.HeaderCell>TEAM</Table.HeaderCell>
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>PROBLEM</Table.HeaderCell>
            <Table.HeaderCell>STATUS</Table.HeaderCell>
            <Table.HeaderCell>CPU</Table.HeaderCell>
            <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell colSpan={3}>TEST CASES</Table.HeaderCell>
            <Table.HeaderCell colSpan={3}>SCORE</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell rowspan={2}>
              <a href={`/admin/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</a>
            </Table.Cell>
            <Table.Cell>{submission.team_name}</Table.Cell>
            <Table.Cell>{submission.date * 1000}</Table.Cell>
            <Table.Cell><a href={`/admin/problems/${submission.prob_id}/edit`}>{submission.prob_name}</a></Table.Cell>
            <Table.Cell className={`icn ${submission.status}`}></Table.Cell>
            <Table.Cell>{`${submission.runtime}`.substring(0, 4)}</Table.Cell>
            <Table.Cell>{submission.language}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colSpan={3}>
              {submission.tests.map((test: TestType) => {
                switch (test.result) {
                  case 'accepted':
                    return <span className='result icn accepted' />
                  case 'rejected':
                    return <span className='result icn rejected' />
                  default:
                    return <span className='result' />
                }
              })}
            </Table.Cell>
            <Table.Cell colSpan={3}>{submission.score}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Block>
  )
}

export default Submission