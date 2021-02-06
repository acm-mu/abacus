import React, { useState, useEffect } from 'react'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { SubmissionType } from '../../types'
import { Block, Countdown } from '../../components'
import config from '../../environment'

const Submissions = (): JSX.Element => {

  const [submissions, setSubmissions] = useState([])

  useEffect((): void => {

    fetch(`${config.API_URL}/v1/submissions`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)
        setSubmissions(data)
      })

  }, [])

  return (
    <>
      <Countdown />
      <Block size='xs-12' transparent>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Submission ID</Table.HeaderCell>
              <Table.HeaderCell>Problem</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell>Submission #</Table.HeaderCell>
              <Table.HeaderCell>Language</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Runtime</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.length > 0 ? (submissions.map((submission: SubmissionType, index: number) =>
            (<Table.Row key={index}>
              <Table.Cell><Link to={`/admin/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</Link></Table.Cell>
              <Table.Cell><Link to={`/admin/problems/${submission.problem_id}/edit`}>{submission.prob_name} </Link></Table.Cell>
              <Table.Cell>{submission.team_name}</Table.Cell>
              <Table.Cell>{submission.sub_no + 1}</Table.Cell>
              <Table.Cell>{submission.language}</Table.Cell>
              <Table.Cell className={`icn ${submission.status}`} />
              <Table.Cell>{submission.runtime}</Table.Cell>
              <Table.Cell fromnow={submission.date * 1000} />
              <Table.Cell>{submission.score}</Table.Cell>
            </Table.Row>)
            )) : (
                <Table.Cell colspan="7" style={{ textAlign: "center" }}>No Submissions</Table.Cell>)
            }
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Submissions