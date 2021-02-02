import React, { useState } from 'react'
import { Table } from 'semantic-ui-react'
import { Block } from '../../components'
import { SubmissionType } from '../../types'

const Submissions = (): JSX.Element => {
  const [submissions] = useState([])
  return (

    <Block size='xs-12' transparent>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Submission ID</Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Submission #</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.length > 0 ?
            (submissions.map((submission: SubmissionType, index: number) => (
              <Table.Row key={index}>
                <Table.Cell><a href={`/gold/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</a></Table.Cell>
                <Table.Cell><a href={`/gold/problems/${submission.problem_id}`}>{submission.prob_name} </a></Table.Cell>
                <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                <Table.Cell className={`icn ${submission.status}`}></Table.Cell>
                <Table.Cell fromnow="{{ submission.date*1000 }}"></Table.Cell>
                <Table.Cell>{submission.score}</Table.Cell>
              </Table.Row>
            ))) : (
              <Table.Row>
                <Table.Cell colspan="7" style="text-align: center">No Submissions</Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table>
    </Block>
  )
}

export default Submissions