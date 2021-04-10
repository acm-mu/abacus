import { Submission } from 'abacus'
import React, { ChangeEvent, useState, useEffect, useMemo, useContext } from 'react'
import { Button, Checkbox, Label, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import config from 'environment'
import { sorted } from 'utils'
import { Helmet } from 'react-helmet'
import { PageLoading } from 'components'
import { SocketContext } from 'context'

interface SubmissionItem extends Submission {
  checked: boolean
}
type SortKey = 'date' | 'sid' | 'sub_no' | 'language' | 'status' | 'runtime' | 'date' | 'score'
type SortConfig = {
  column: SortKey,
  direction: 'ascending' | 'descending'
}

const Submissions = (): JSX.Element => {
  const socket = useContext(SocketContext)
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  const [isDeleting, setDeleting] = useState(false)
  const [showReleased, setShowReleased] = useState(false)

  const [submissionMap, setSubmissionMap] = useState<{ [key: string]: SubmissionItem }>({})

  const submissions = useMemo<SubmissionItem[]>(() => {
    const list: Record<string, any>[] = Object.values(submissionMap)

    return sorted(list, column, direction).filter(submission => showReleased || !submission.released) as SubmissionItem[]
  }, [submissionMap, column, direction, showReleased])

  const sort = (newColumn: SortKey) =>
    setSortConfig({ column: newColumn, direction: column === newColumn ? 'descending' : 'ascending' })

  useEffect(() => {
    loadSubmissions().then(() => setLoading(false))
    socket?.on('new_submission', loadSubmissions)
    return () => setMounted(false)
  }, [])

  const loadSubmissions = async () => {
    const response = await fetch(`${config.API_URL}/submissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    setSubmissionMap(await response.json()) // may need to default
  }

  const onFilterChange = () => setShowReleased(!showReleased)

  const downloadSubmissions = () => saveAs(new File([JSON.stringify(submissions, null, '\t')], 'submissions.json', { type: 'text/json;charset=utf-8' }))
  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => { return } //setSubmissionsMap(submissions.map(submission => submission.sid == id ? { ...submission, checked } : submission))
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => { return } // setSubmissionsMap(submissions.map(submission => ({ ...submission, checked })))

  const deleteSelected = async () => {
    setDeleting(true)
    const submissionsToDelete = submissions.filter(submission => submission.checked && (!submission.released || showReleased)).map(submission => submission.sid)
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submissionsToDelete })
    })
    if (response.ok) {
      loadSubmissions()
    }
    setDeleting(false)
  }

  if (isLoading) return <PageLoading />

  return <>
    <Helmet><title>Abacus | Admin Submissions</title></Helmet>
    <Button content="Download Submissions" onClick={downloadSubmissions} />
    {submissions.filter(submission => submission.checked).length ?
      <Button content="Delete Selected" negative onClick={deleteSelected} loading={isDeleting} disabled={isDeleting} /> : <></>}
    <Checkbox toggle label="Show Released" checked={showReleased} onClick={onFilterChange} />

    <Table singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('sid')}>Submission ID</Table.HeaderCell>
          <Table.HeaderCell>Problem</Table.HeaderCell>
          <Table.HeaderCell>Team</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('sub_no')}>Submission #</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('language')}>Language</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('status')}>Status</Table.HeaderCell>
          <Table.HeaderCell>Released</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('runtime')}>Runtime</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('date')}>Time</Table.HeaderCell>
          <Table.HeaderCell className='sortable' onClick={() => sort('score')}>Score</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {submissions.length == 0 ?
          <Table.Row>
            <Table.Cell colSpan={'100%'}>No Submissions</Table.Cell>
          </Table.Row> :
          submissions.map(submission =>
            <Table.Row key={submission.sid}>
              <Table.Cell><input type='checkbox' checked={submission.checked} id={submission.sid} onChange={handleChange} /></Table.Cell>
              <Table.Cell>
                <Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link></Table.Cell>
              <Table.Cell><Link to={`/admin/problems/${submission.pid}`}>{submission.problem?.name} </Link></Table.Cell>
              <Table.Cell><Link to={`/admin/users/${submission.team.uid}`}>{submission.team.display_name}</Link></Table.Cell>
              <Table.Cell>{submission.sub_no + 1}</Table.Cell>
              <Table.Cell>{submission.language}</Table.Cell>
              <Table.Cell><span className={`status icn ${submission.status}`} /></Table.Cell>
              <Table.Cell>{submission.released ? <Label color='green' icon='check' content="Released" /> : <Label icon='lock' content="Held" />}</Table.Cell>
              <Table.Cell>{Math.floor(submission.runtime || 0)}</Table.Cell>
              <Table.Cell><Moment fromNow date={submission.date * 1000} /> </Table.Cell>
              <Table.Cell>{submission.score}</Table.Cell>
            </Table.Row>
          )}
      </Table.Body>
    </Table>
  </>
}

export default Submissions