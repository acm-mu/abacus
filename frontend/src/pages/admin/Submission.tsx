import React, { useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Table } from 'semantic-ui-react'
import { Block } from '../../components'
import { SubmissionType, TestType } from '../../types'
import config from '../../environment'
import Moment from 'react-moment'

const Submission = (): JSX.Element => {
  const history = useHistory()
  const { submission_id } = useParams<{ submission_id: string }>()
  const [submission, setSubmission] = useState<SubmissionType>()

  useEffect(() => {
    loadSubmission()
  }, [])

  const loadSubmission = () => {
    fetch(`${config.API_URL}/submissions?submission_id=${submission_id}`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setSubmission(data)
      })
  }

  const deleteSubmission = () => {
    fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ submission_id })
    }).then(res => {
      if (res.status == 200) {
        history.push("/admin/submissions")
      }
    })
  }

  const rerun = () => {
    fetch(`${config.API_URL}/submissions/rerun`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ submission_id })
    }).then(res => res.json())
      .then(res => {
        if (submission_id in res.submissions)
          setSubmission({ ...submission, ...res.submissions[submission_id] })
      })
  }

  return (
    <Block transparent size='xs-12'>

      <Button content="Rerun" icon="redo" labelPosition="left" onClick={rerun} />
      <Button content="Delete" icon="trash" negative labelPosition="left" onClick={deleteSubmission} />

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
            <Table.HeaderCell>TEAM</Table.HeaderCell>
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>PROBLEM</Table.HeaderCell>
            <Table.HeaderCell>STATUS</Table.HeaderCell>
            <Table.HeaderCell>CPU</Table.HeaderCell>
            <Table.HeaderCell>SCORE</Table.HeaderCell>
            <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell colSpan={7}>TEST CASES</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {submission ?
          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan={2}>
                <Link to={`/admin/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</Link>
              </Table.Cell>
              <Table.Cell>{submission.team.display_name}</Table.Cell>
              <Table.Cell><Moment fromNow date={submission?.date * 1000} /></Table.Cell>
              <Table.Cell><Link to={`/admin/problems/${submission.problem_id}`}>{submission.problem.problem_name}</Link></Table.Cell>
              <Table.Cell><span className={`icn status ${submission.status}`} /></Table.Cell>
              <Table.Cell>{Math.floor(submission.runtime)}</Table.Cell>
              <Table.Cell>{submission.score}</Table.Cell>
              <Table.Cell>{submission.language}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan={7}>
                {submission?.tests.map((test: TestType, index: number) => {
                  switch (test.result) {
                    case 'accepted':
                      return <span key={`test-${index}`} className='result icn accepted' />
                    case 'rejected':
                      return <span key={`test-${index}`} className='result icn rejected' />
                    default:
                      return <span key={`test-${index}`} className='result icn' />
                  }
                })}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          : <></>}
      </Table>
    </Block>
  )
}

export default Submission