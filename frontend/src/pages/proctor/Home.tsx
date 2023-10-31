import type { ISubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { Block, PageLoading, Unauthorized } from 'components'
import { AppContext, SocketContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Label, Table } from 'semantic-ui-react'

const Home = (): React.JSX.Element => {
  usePageTitle("Abacus | Proctor Dashboard")

  const submissionRepository = new SubmissionRepository()

  const { user } = useContext(AppContext)
  if (user?.role != 'proctor') return <Unauthorized />
  
  const socket = useContext(SocketContext)

  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ISubmission[]>()

  const flaggedSubmissions = useMemo(() => {
    return submissions?.filter(({ flagged }) => flagged)
      .sort((s1, s2) => s2.date - s1.date)
  }, [submissions])

  const unviewedSubmission = useMemo(() => {
    return submissions?.filter(s => !s.viewed)
  }, [submissions])

  const loadData = async () => {
    const response = await submissionRepository.getMany({
      filterBy: {
        division: 'blue'
      }
    })

    if (response.ok && response.data) {
      setSubmissions(Object.values(response.data))
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
      .catch(console.error)
  }, [])

  useEffect(() => {
    socket?.on('new_submission', loadData)
    socket?.on('update_submission', loadData)
  }, [socket])

  if (isLoading) return <PageLoading />

  return (
    <>
      <Block transparent size="xs-6">
        <h1>Unviewed Submissions</h1>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="Submission" />
              <Table.HeaderCell content="Problem" />
              <Table.HeaderCell content="Language" />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!unviewedSubmission?.length ?
              <>
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              </> :
              unviewedSubmission.map(submission =>
                <Table.Row key={`viewed-${submission.sid}`}>
                  <Table.Cell>
                    <Link to={`/proctor/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/proctor/problems/${submission.pid}`}>{submission.problem.name}</Link>
                  </Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
      </Block>

      <Block transparent size="xs-6">
        <h1>Flagged Submissions</h1>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="Submission" />
              <Table.HeaderCell content="Problem" />
              <Table.HeaderCell content="Language" />
              <Table.HeaderCell content="Status" />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!flaggedSubmissions?.length ?
              <>
                <Table.Row>
                  <Table.Cell colSpan={'100%'}>There are no submissions that match this description.</Table.Cell>
                </Table.Row>
              </> :
              flaggedSubmissions?.map(submission =>
                <Table.Row key={`recent-${submission.sid}`}>
                  <Table.Cell>
                    <Link to={`/proctor/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/proctor/problems/${submission.pid}`}>{submission.problem.name}</Link>
                  </Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                  <Table.Cell>
                    {submission.flagged ? (
                      <Label color="orange" icon="flag" content={`Flagged: ${submission.flagged.display_name}`} />
                    ) : (
                      <Label icon="check" content="Unflagged" />
                    )}
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Home
