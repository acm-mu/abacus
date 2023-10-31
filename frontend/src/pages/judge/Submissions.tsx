import type { ISubmission, SortConfig } from 'abacus'
import { SubmissionRepository } from 'api'
import { PageLoading } from 'components'
import { AppContext, SocketContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Label, Table } from 'semantic-ui-react'

interface SubmissionItem extends ISubmission {
  checked: boolean
}

const Submissions = (): React.JSX.Element => {
  usePageTitle("Abacus | Judge Submissions")

  const submissionRepo = new SubmissionRepository()

  const socket = useContext(SocketContext)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>()
  const [isDeleting, setDeleting] = useState(false)
  const [isClaiming, setClaiming] = useState<{ [key: string]: boolean }>({})
  const [showReleased, setShowReleased] = useState(false)
  const filter = new URLSearchParams(window.location.search).get('filter')

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
    socket?.on('new_submission', loadSubmissions)
    socket?.on('update_submission', loadSubmissions)
  }, [])

  useEffect(() => {
    loadSubmissions().catch(console.error)
  }, [sortBy, sortDirection])

  const loadSubmissions = async () => {
    setLoading(true)

    const response = await submissionRepo.getMany({
      filterBy: {
        division: user?.division
      },
      sortBy, sortDirection
    })

    if (response.ok && response.data) {
      setSubmissions(
        Object.values(response.data)
          .filter((submission) => !submission.team?.disabled)
          .map((submission) => ({ ...submission, checked: false })))
    }

    setLoading(false)
  }

  const onFilterChange = () => setShowReleased(!showReleased)

  const downloadSubmissions = () => {
    saveAs(new File([JSON.stringify(submissions, null, '\t')], 'submissions.json', { type: 'text/json;charset=utf-8' }))
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => {
    setSubmissions(submissions?.map((submission) => (submission.sid == id ? { ...submission, checked } : submission)))
  }

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setSubmissions(submissions?.map((submission) => ({ ...submission, checked })))
  }

  const deleteSelected = async () => {
    setDeleting(true)

    const submissionsToDelete = submissions?.filter((submission) => submission.checked).map((submission) => submission.sid)

    if (submissionsToDelete) {
      const response = await submissionRepo.delete(submissionsToDelete)

      if (response.ok) {
        await loadSubmissions()
      }
    }

    setDeleting(false)
  }

  const claim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })

    const submissionRepo = new SubmissionRepository()
    const response = await submissionRepo.update(sid, { claimed: user?.uid })

    if (response.ok) {
      setSubmissions(submissions?.map((sub) => (sub.sid == sid ? { ...sub, claimed: user } : sub)))
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  const unclaim = async (sid: string) => {
    setClaiming({ ...isClaiming, [sid]: true })
    const response = await submissionRepo.update(sid, { claimed: undefined })

    if (response.ok) {
      setSubmissions(submissions?.map((sub) => (sub.sid == sid ? { ...sub, claimed: undefined } : sub)))
    }

    setClaiming({ ...isClaiming, [sid]: false })
  }

  const urlFilter = ({ claimed }: ISubmission) => {
    switch (filter) {
      case 'my_claimed':
        return !showReleased && claimed?.uid == user?.uid
      case 'other_claimed':
        return !showReleased && claimed !== undefined && claimed?.uid != user?.uid
      case 'pending':
        return !showReleased && !claimed
      case 'recently_graded':
        return !showReleased
      default:
        return true
    }
  }

  const filteredSubmissions = useMemo(() => {
    return submissions?.filter((submission) => showReleased || (!submission.released && urlFilter(submission)))
  }, [submissions, showReleased, filter])

  if (isLoading) return <PageLoading />

  return (
    <>
      <Button content="Download Submissions" onClick={downloadSubmissions} />
      {submissions?.filter((submission) => submission.checked).length ? (
        <Button
          content="Delete Selected"
          negative
          onClick={deleteSelected}
          loading={isDeleting}
          disabled={isDeleting}
        />
      ) : (
        <></>
      )}
      {filter && (
        <Button as={Link} to="/judge/submissions">
          Clear Filter: <i>{filter}</i>
        </Button>
      )}
      <Checkbox toggle label="Show Released" checked={showReleased} onClick={onFilterChange} />

      <Table singleLine sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>
              <input type="checkbox" onChange={checkAll} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('sid')}
              sorted={sortBy == 'sid' ? sortDirection : undefined}>
              Submission ID
            </Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('language')}
              sorted={sortBy == 'language' ? sortDirection : undefined}>
              Language
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('status')}
              sorted={sortBy == 'status' ? sortDirection : undefined}>
              Status
            </Table.HeaderCell>
            <Table.HeaderCell>Claimed</Table.HeaderCell>
            <Table.HeaderCell>Released</Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('date')}
              sorted={sortBy == 'date' ? sortDirection : undefined}>
              Time
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable"
              onClick={() => sort('score')}
              sorted={sortBy == 'score' ? sortDirection : undefined}>
              Score
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!filteredSubmissions?.length ? (
            <Table.Row>
              <Table.Cell colSpan={'100%'}>No Submissions</Table.Cell>
            </Table.Row>
          ) : (
            filteredSubmissions.map((submission) => {
              return (
                <Table.Row key={submission.sid}>
                  <Table.Cell>
                    <input type="checkbox" checked={submission.checked} id={submission.sid} onChange={handleChange} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/problems/${submission.pid}`}>{submission.problem?.name} </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/${user?.role}/teams`}>{submission.team?.display_name}</Link>
                  </Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                  <Table.Cell>
                    <span className={`status icn ${submission.status}`} />
                  </Table.Cell>
                  <Table.Cell>
                    {submission.claimed ? (
                      submission.claimed?.uid === user?.uid ? (
                        <Button
                          content="Unclaim"
                          icon={'hand paper'}
                          onClick={() => unclaim(submission.sid)}
                          loading={isClaiming[submission.sid]}
                          disabled={isClaiming[submission.sid]}
                          labelPosition={'left'}
                        />
                      ) : (
                        <Button content="Claimed" icon={'lock'} disabled={true} labelPosition={'left'} />
                      )
                    ) : (
                      <Button
                        content="Claim"
                        icon={'hand rock'}
                        onClick={() => claim(submission.sid)}
                        loading={isClaiming[submission.sid]}
                        disabled={isClaiming[submission.sid]}
                        labelPosition={'left'}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {submission.released ? (
                      <Label color="green" icon="check" content="Released" />
                    ) : (
                      <Label icon="lock" content="Held" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Moment fromNow date={submission.date * 1000} />
                  </Table.Cell>
                  <Table.Cell>{submission.score}</Table.Cell>
                </Table.Row>
              )
            })
          )}
        </Table.Body>
      </Table>
    </>
  )
}

export default Submissions
