import type { ISubmission, SortConfig } from 'abacus'
import { SubmissionRepository } from 'api'
import { PageLoading } from 'components'
import { AppContext, SocketContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Label, Table } from 'semantic-ui-react'

const Submissions = (): React.JSX.Element => {
  usePageTitle("Abacus | Proctor Submissions")

  const submissionRepository = new SubmissionRepository()

  const socket = useContext(SocketContext)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ISubmission[]>()
  const [isMounted, setMounted] = useState(true)
  const [showViewed, setShowViewed] = useState(false)

  const { user } = useContext(AppContext)

  const [{ sortBy, sortDirection }, setSortConfig] = useState<SortConfig<ISubmission>>({
    sortBy: 'date',
    sortDirection: 'ascending'
  })

  const sort = (newColumn: keyof ISubmission) => {
    setSortConfig({
      sortBy: newColumn,
      sortDirection: sortBy === newColumn && sortDirection == 'ascending' ? 'descending' : 'ascending'
    })
  }

  useEffect(() => {
    loadSubmissions().then(() => setLoading(false))
    socket?.on('new_submission', loadSubmissions)
    socket?.on('update_submission', loadSubmissions)
    return () => setMounted(false)
  }, [])

  const loadSubmissions = async () => {
    const response = await submissionRepository.getMany({
      filterBy: { division: 'blue' },
      sortBy,
      sortDirection
    })

    if (!isMounted) return

    if (response.data) {
      setSubmissions(Object.values(response.data))
    }
  }

  useEffect(() => {
    loadSubmissions().catch(console.error)
  }, [sortBy, sortDirection])

  const onFilterChange = () => setShowViewed(!showViewed)

  const filteredSubmissions = useMemo(
    () => submissions?.filter((submission) => showViewed || (!submission.viewed && !submission.flagged)),
    [submissions, showViewed]
  )

  if (isLoading) return <PageLoading />

  return (
    <>
      <Checkbox toggle label="Show Viewed" checked={showViewed} onClick={onFilterChange} />

      <Table singleLine sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('sid')}
              sorted={sortBy == 'sid' ? sortDirection : undefined}>
              Submission ID
            </Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('language')}
              sorted={sortBy == 'language' ? sortDirection : undefined}>
              Language
            </Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!filteredSubmissions?.length ? (
            <Table.Row>
              <Table.Cell colSpan={'100%'}>No Submissions</Table.Cell>
            </Table.Row>
          ) : (
            filteredSubmissions.map((submission) => (
              <Table.Row key={submission.sid}>
                <Table.Cell>
                  <Link to={`/${user?.role}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/${user?.role}/problems/${submission.pid}`}>{submission.problem?.name} </Link>
                </Table.Cell>
                <Table.Cell>{submission.language}</Table.Cell>
                <Table.Cell>
                  {submission.flagged ? (
                    <Label
                      color="orange"
                      icon="flag"
                      content={`Flagged: ${
                        submission.flagged.uid === user?.uid ? 'You' : submission.flagged.display_name
                      }`}
                    />
                  ) : submission.viewed ? (
                    <Label icon="eye" color="green" content="Viewed" />
                  ) : (
                    <Label icon="cloud download" content="Unviewed" />
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </>
  )
}

export default Submissions
