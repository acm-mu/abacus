import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Block, Countdown } from '../../components'
import config from '../../environment'
import { SubmissionType } from '../../types'

const Submission = (): JSX.Element => {
  const [submission, setSubmission] = useState<SubmissionType>()
  const { submission_id } = useParams<{ submission_id: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/v1/submissions?submission_id=${submission_id}`)
      .then(res => res.json())
      .then(res => {
        if (res) setSubmission(Object.values(res)[0] as SubmissionType);
      })
  }, [])

  return (
    <>
      <Countdown />
      <Block size="xs-12">
        <h1>Submission</h1>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowspan="2">ID</Table.HeaderCell>
              <Table.HeaderCell>DATE</Table.HeaderCell>
              <Table.HeaderCell>PROBLEM</Table.HeaderCell>
              <Table.HeaderCell>STATUS</Table.HeaderCell>
              <Table.HeaderCell>CPU</Table.HeaderCell>
              <Table.HeaderCell>LANG</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell colSpan={5}>TEST CASES</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell rowspan="2"><Link to={`/blue/submissions/${submission?.submission_id}`}>{submission?.submission_id.substring(0, 7)}</Link>
              </Table.Cell>
              <Table.Cell>{submission && <Moment fromNow>{submission.date * 1000}</Moment>}</Table.Cell>
              <Table.Cell><Link to={`/blue/problems/${submission?.problem_id}`}> {submission?.prob_name}</Link></Table.Cell>
              <Table.Cell class={`icn ${submission?.status}`}></Table.Cell>
              <Table.Cell> {`${submission?.runtime}`.substring(0, 4)} </Table.Cell>
              <Table.Cell> {submission?.language} </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colspan="5">
                {submission?.tests.map((test) => {
                  console.log(test.result)
                  switch (test.result) {
                    case 'accepted':
                      return (<span className='result icn accepted' />)
                    case 'rejected':
                      return (<span className='result icn rejected' />)
                    default:
                      return (<span className='result' />)
                  }
                })}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Block>

      <Block size="xs-12">
        <p>Submission contains 1 file:</p>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>FILENAME</Table.HeaderCell>
              <Table.HeaderCell>FILESIZE</Table.HeaderCell>
              <Table.HeaderCell>SHA-1 SUM</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell> {submission?.filename}</Table.Cell>
              <Table.Cell> {submission?.filesize}  bytes</Table.Cell>
              <Table.Cell> {submission?.sha1sum} </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <h3> {submission?.filename} </h3>
        <pre>
          <code className={`${submission?.language}`}> contents </code>
        </pre>
      </Block>
    </>
  )
}

export default Submission