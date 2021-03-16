import { Block, Countdown } from 'components';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Popup, Table } from 'semantic-ui-react';
import config from 'environment'
import MDEditor from '@uiw/react-md-editor';
import "../Problem.scss";
import Moment from 'react-moment';
import { Submission } from 'abacus';
import problem from './problem.json';

const PracticeProblem = (): JSX.Element => {
  const [submissions, setSubmissions] = useState<Submission[]>()

  useEffect(() => {
    const submissions = localStorage.submissions ? JSON.parse(localStorage.submissions) : []
    setSubmissions(Object.values(submissions))
  }, [])

  return <>
    <Countdown />
    {submissions?.length ? <Block size="xs-12">
      <h3>Previous Attempts</h3>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Submission ID</Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Submission #</Table.HeaderCell>
            <Table.HeaderCell>Language</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.sort((s1, s2) => s2.date - s1.date).map((submission: Submission, index: number) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Link to={`/blue/practice/${submission.sid}`}> {submission.sid.substring(0, 7)} </Link>
              </Table.Cell>
              <Table.Cell> {submission.problem?.name} </Table.Cell>
              <Table.Cell> {submission.sub_no + 1} </Table.Cell>
              <Table.Cell> {submission.language} </Table.Cell>
              <Table.Cell> <span className={`status icn ${submission.status}`} /> </Table.Cell>
              <Table.Cell> <Moment fromNow>{submission.date * 1000}</Moment> </Table.Cell>
              <Table.Cell> {submission.score} </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Block> : <></>}

    <Block size='xs-9' className='problem'>
      <MDEditor.Markdown source={problem.description} />
    </Block>

    <Block size='xs-3'>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Popup
          trigger={
            <Button
              as={Link}
              to={`/blue/practice/submit`}
              content="Submit"
              icon="upload"
            />
          }
          content="Submit"
          position="top center"
          inverted />
      </div>
      <p><b>Problem ID: </b>{problem.id}</p>
      <p><b>CPU Time limit: </b>{problem.cpu_time_limit}</p>
      <p><b>Memory limit: </b>{problem.memory_limit}</p>
      <p><b>Download:</b> <a href={`${config.API_URL}/sample_files?pid=practice problem`}>Sample data files</a></p>
    </Block>
  </>
}

export default PracticeProblem