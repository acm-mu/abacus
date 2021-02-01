import React, { useState, useEffect } from 'react'
import { Form, Button, Input, Table } from 'semantic-ui-react'
import { Block } from '../../components'

const Submission = (): JSX.Element => {
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

  return (
    <>
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
              <Table.HeaderCell colspan={3}>TEST CASES</Table.HeaderCell>
              <Table.HeaderCell colspan={3}>SCORE</Table.HeaderCell>
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
              <Table.Cell class={`icn ${submission.status}`}></Table.Cell>
              <Table.Cell>{`${submission.runtime}`.substring(0, 4)}</Table.Cell>
              <Table.Cell>{submission.language}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan={3}>
                {submission.tests.map((test: any) => {
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
              <Table.Cell colspan={3}>{submission.score}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Block>

      {/* <Block size='xs-12'> */}
      {/* Submission contains 1 file:
  <table class="ui table celled">
    <thead>
      <tr>
        <th>FILENAME</th>
        <th>FILESIZE</th>
        <th>SHA-1 SUM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ submission.filename }}</td>
        <td>{{ submission.filesize }} bytes</td>
        <td>{{ submission.sha1sum }}</td>
      </tr>
    </tbody>
  </table>

  <h3>{{ submission.filename }}</h3>
  <pre>
    <code class="{{ submission.language }}">{{ contents }}</code>
  </pre></Block> */}
    </>
  )
}

export default Submission