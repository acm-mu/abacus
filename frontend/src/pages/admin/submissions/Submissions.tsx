import { Submission } from 'abacus'
import React, { ChangeEvent, useState, useEffect, useMemo } from 'react'
import { Button, Checkbox, Label, Loader, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import config from 'environment'
import { compare } from 'utils'

interface SubmissionItem extends Submission {
  checked: boolean
}
type SortKey = 'date' | 'sid' | 'sub_no' | 'language' | 'status' | 'runtime' | 'date' | 'score'
type SortConfig = {
  column: SortKey,
  direction: 'ascending' | 'descending'
}

const Submissions = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [isMounted, setMounted] = useState<boolean>(true)
  const [showReleased, setShowReleased] = useState(false)

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey, submission_list: SubmissionItem[] = submissions) => {
    const newDirection = column === newColumn ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setSubmissions(submission_list.sort((s1: Submission, s2: Submission) =>
    (compare(s1[newColumn] || 'ZZ', s2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
    )))
  }

  useEffect(() => {
    loadSubmissions().then(() => setLoading(false))
    const timeInterval = setInterval(loadSubmissions, 5 * 1000)
    return () => {
      clearInterval(timeInterval)
      setMounted(false)
    }
  }, [])

  const loadSubmissions = async () => {
    const response = await fetch(`${config.API_URL}/submissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    const submissions = Object.values(await response.json()) as SubmissionItem[]

    if (!isMounted) return

    setSubmissions(submissions.map(submission => ({ ...submission, checked: false })))
  }

  const onFilterChange = () => setShowReleased(!showReleased)

  const downloadSubmissions = () => saveAs(new File([JSON.stringify(submissions, null, '\t')], 'submissions.json', { type: 'text/json;charset=utf-8' }))
  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => setSubmissions(submissions.map(submission => submission.sid == id ? { ...submission, checked } : submission))
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => setSubmissions(submissions.map(submission => ({ ...submission, checked })))

  const deleteSelected = async () => {
    const submissionsToDelete = submissions.filter(submission => submission.checked).map(submission => submission.sid)
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
  }

  const filteredSubmissions = useMemo(() =>
    submissions.filter((submission) => showReleased || !submission.released)
    , [submissions, showReleased])

  if (isLoading) return <Loader active inline='centered' content="Loading" />

  return (
    <>
      <Button content="Download Submissions" onClick={downloadSubmissions} />
      {submissions.filter(submission => submission.checked).length ?
        <Button content="Delete Submission(s)" negative onClick={deleteSelected} /> : <></>}
      <Checkbox toggle label="Show Released" checked={showReleased} onClick={onFilterChange} />
      {/* <Button icon={showReleased ? 'eye' : 'eye slash'} color={showReleased ? "green" : undefined} content="Show Released" onClick={onFilterChange} /> */}

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
          {filteredSubmissions.length == 0 ?
            <Table.Row>
              <Table.Cell colSpan={10} style={{ textAlign: "center" }}>No Submissions</Table.Cell>
            </Table.Row> :
            filteredSubmissions.map((submission) =>
              <Table.Row key={submission.sid}>
                <Table.Cell>
                  <input
                    type='checkbox'
                    checked={submission.checked}
                    id={submission.sid}
                    onChange={handleChange} />
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link></Table.Cell>
                <Table.Cell><Link to={`/admin/problems/${submission.pid}`}>{submission.problem?.name} </Link></Table.Cell>
                <Table.Cell><Link to={`/admin/users/${submission.team.uid}`}>{submission.team.display_name}</Link></Table.Cell>
                <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                <Table.Cell>{submission.language}</Table.Cell>
                <Table.Cell><span className={`status icn ${submission.status}`} /></Table.Cell>
                <Table.Cell>{submission.released ? <Label color='green' icon='check' content="Released" /> : <Label icon='lock' content="Held" />}</Table.Cell>
                <Table.Cell>{Math.floor(submission.runtime)}</Table.Cell>
                <Table.Cell><Moment fromNow date={submission.date * 1000} /> </Table.Cell>
                <Table.Cell>{submission.score}</Table.Cell>
              </Table.Row>)}
        </Table.Body>
      </Table>
    </>
  )
}

export default Submissions