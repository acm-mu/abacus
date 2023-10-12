import React, { useEffect, useState } from 'react'
import { Problem, Submission } from 'abacus'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Button, Table } from 'semantic-ui-react'
import MDEditor from '@uiw/react-md-editor'

import { Block, Countdown, NotFound, PageLoading } from 'components'
import Moment from 'react-moment'
import '../Problem.scss'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

interface PracticeProblemProps {
  submissions: Submission[]
}

const PracticeProblem = ({ submissions }: PracticeProblemProps): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<Problem>()
  const [isLoading, setLoading] = useState(true)

  usePageTitle(`Abacus | ${problem?.name ?? ""}`)

  useEffect(() => {
    fetch(`/problems/${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setProblem(data)
        setLoading(false)
      })
  }, [])


  const downloadFiles = () => {
    if (problem?.skeletons)
      for (const skeleton of problem.skeletons) {
        saveAs(new File([skeleton.source], skeleton.file_name, { type: 'text/plain;charset=utf-8' }))
      }
  }

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return (
    <>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/practice" content="Practice" />
          <Breadcrumb.Divider />
          <Breadcrumb.Section active content={problem.name} />
        </Breadcrumb>
      </Block>
      {submissions?.length ? (
        <Block transparent size="xs-12">
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
              {submissions
                .sort((s1, s2) => s2.date - s1.date)
                .map((submission: Submission, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Link to={`/blue/practice/${submission.sid}`}> {submission.sid.substring(0, 7)} </Link>
                    </Table.Cell>
                    <Table.Cell> {submission.problem?.name} </Table.Cell>
                    <Table.Cell> {submission.sub_no + 1} </Table.Cell>
                    <Table.Cell> {submission.language} </Table.Cell>
                    <Table.Cell>
                      {' '}
                      <span className={`status icn ${submission.status}`} />{' '}
                    </Table.Cell>
                    <Table.Cell>
                      {' '}
                      <Moment fromNow>{submission.date * 1000}</Moment>{' '}
                    </Table.Cell>
                    <Table.Cell> {submission.score} </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </Block>
      ) : (
        <></>
      )}

      <Block size="xs-9" className="problem">
        <MDEditor.Markdown source={problem.description} />
      </Block>

      <Block size="xs-3" className="problem-panel">
        {problem?.tests ? (
          <Button as={Link} primary to={`/blue/practice/${id}/submit`} content="Submit" icon="upload" />
        ) : (
          <></>
        )}
        {problem.skeletons?.length ? <Button onClick={downloadFiles} content="Sample Files" icon="download" /> : <></>}
      </Block>
    </>
  )
}
export default PracticeProblem
