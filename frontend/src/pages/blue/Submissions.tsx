import { Submission } from 'abacus'
import React, { useContext, useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Block, Countdown, PageLoading, Unauthorized } from 'components'
import { AppContext } from 'context'
import config from 'environment'
import { usePageTitle } from 'hooks'

const Submissions = (): React.JSX.Element => {
  usePageTitle("Abacus | Blue Submissions")

  const { user } = useContext(AppContext)
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>()

  useEffect(() => {
    loadSubmissions()
    return () => {
      setMounted(false)
    }
  }, [])

  const loadSubmissions = async () => {
    const response = await fetch(`${config.API_URL}/submissions?division=blue&tid=${user?.uid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (!isMounted) return
    if (response.ok) {
      setSubmissions(Object.values(await response.json()))
    }
    setLoading(false)
  }

  if (!user) return <Unauthorized />
  if (isLoading) return <PageLoading />
  if (user?.division != 'blue' && user?.role != 'admin') return <Unauthorized />

  return (
    <>
      <Countdown />
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
            {submissions?.length ? (
              submissions
                .sort((s1, s2) => s2.date - s1.date)
                .map((submission: Submission, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Link to={`/blue/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/blue/problems/${submission.problem?.id}`}>{submission.problem?.name}</Link>
                    </Table.Cell>
                    <Table.Cell> {submission.sub_no + 1} </Table.Cell>
                    <Table.Cell> {submission.language} </Table.Cell>
                    <Table.Cell>
                      <span className={`status icn ${submission.status}`} />
                    </Table.Cell>
                    <Table.Cell>
                      <Moment fromNow>{submission.date * 1000}</Moment>
                    </Table.Cell>
                    <Table.Cell> {submission.score} </Table.Cell>
                  </Table.Row>
                ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={'100%'}>You don&lsquo;t have any submissions yet. Go write some code!</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Submissions
