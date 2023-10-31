import type { IGoldSubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { Block, Countdown, PageLoading, Unauthorized } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import 'components/Icons.scss'

const Submissions = (): React.JSX.Element => {
  usePageTitle("Abacus | Gold Submissions")

  const submissionRepo = new SubmissionRepository()

  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<IGoldSubmission[]>()

  useEffect(() => {
    loadSubmissions().catch(console.error)
  }, [])

  const loadSubmissions = async () => {
    const response = await submissionRepo.getMany({
      filterBy: {
        teamId: user?.uid
      }
    })

    if (response.ok && response.data) {
      setSubmissions(Object.values(response.data) as IGoldSubmission[])
    }

    setLoading(false)
  }

  if (!user) return <Unauthorized />
  if (isLoading) return <PageLoading />
  if (user?.division != 'gold' && user?.role != 'admin') return <Unauthorized />

  return <>
    <Countdown />
    <Block size="xs-12" transparent>
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
          <SubmissionTableBody submissions={submissions} />
        </Table.Body>
      </Table>
    </Block>
  </>
}

const SubmissionTableBody = ({ submissions }: { submissions?: IGoldSubmission[] }) => {
  if (!submissions?.length) {
    return <Table.Row>
      <Table.Cell colSpan={'100%'}>You don&lsquo;t have any submissions yet. Go create a project!</Table.Cell>
    </Table.Row>
  }

  return <>
    {submissions?.sort((s1, s2) => s2.date - s1.date)
      .map(submission =>
        <Table.Row key={`gold-submissions-table-${submission.sid}`}>
          <Table.Cell>
            <Link to={`/gold/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
          </Table.Cell>
          <Table.Cell>
            <Link to={`/gold/problems/${submission.problem.id}`}>{submission.problem?.name} </Link>
          </Table.Cell>
          <Table.Cell>{submission.sub_no + 1}</Table.Cell>
          <Table.Cell>
            <span className={`icn status ${submission.status}`} />
          </Table.Cell>
          <Table.Cell>
            <Moment fromNow date={submission.date * 1000} />
          </Table.Cell>
          <Table.Cell>{submission.score}</Table.Cell>
        </Table.Row>
      )}
  </>
}

export default Submissions
