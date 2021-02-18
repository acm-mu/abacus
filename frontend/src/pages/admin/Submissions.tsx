import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Loader, Popup, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { SubmissionType } from '../../types'
import { Block } from '../../components'
import config from '../../environment'

interface SubmissionItem extends SubmissionType {
  checked: boolean
}

const Submissions = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [isMounted, setMounted] = useState<boolean>(false)
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'ascending'
  })

  const sort = (key: string) => {
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      setSortConfig({ key, direction: 'descending' })
    else
      setSortConfig({ key, direction: 'ascending' })
  }


  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/submissions`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const submissions: SubmissionType[] = Object.values(data)
          setSubmissions(submissions.map(submission => ({ ...submission, checked: false })))
          setLoading(false)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissions(submissions.map(submission => submission.submission_id == event.target.id ? { ...submission, checked: !submission.checked } : submission))
  }

  const checkAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissions(submissions.map(submission => ({ ...submission, checked: event.target.checked })))
  }

  const deleteSelected = () => {
    const submissionsToDelete = submissions.filter(submission => submission.checked).map(submission => submission.submission_id)
    fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ submission_id: submissionsToDelete })
    }).then(res => {
      if (res.status == 200) {
        setSubmissions(submissions.filter(submission => !submissionsToDelete.includes(submission.submission_id)))
      }
    })
  }

  return (
    <>
      <Block size='xs-12' transparent>
        <ButtonGroup>
          <Popup content='Export to JSON' trigger={<a href={`${config.API_URL}/submissions.json`}><Button icon='download' /></a>} />
          {submissions.filter(submission => submission.checked).length &&
            <Popup content='Delete Selected' trigger={<Button icon='trash' negative onClick={deleteSelected} />} />}
        </ButtonGroup>
        {isLoading ?
          <Loader active inline='centered' content="Loading" /> :
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('submission_id')}>Submission ID</Table.HeaderCell>
                <Table.HeaderCell>Problem</Table.HeaderCell>
                <Table.HeaderCell>Team</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('sub_no')}>Submission #</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('language')}>Language</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('status')}>Status</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('runtime')}>Runtime</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('date')}>Time</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('score')}>Score</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {submissions.length ? (submissions.sort(
                (s1: any, s2: any) => `${s1[sortConfig.key]}`.localeCompare(`${s2[sortConfig.key]}`) * (sortConfig.direction == 'ascending' ? 1 : -1)
              ).map((submission: SubmissionItem) =>
                <Table.Row key={submission.submission_id}>
                  <Table.Cell>
                    <input
                      type='checkbox'
                      checked={submission.checked}
                      id={submission.submission_id}
                      onChange={handleChange} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</Link></Table.Cell>
                  <Table.Cell><Link to={`/admin/problems/${submission.problem_id}`}>{submission.problem.problem_name} </Link></Table.Cell>
                  <Table.Cell><Link to={`/admin/users/${submission.team.user_id}`}>{submission.team.display_name}</Link></Table.Cell>
                  <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                  <Table.Cell>{submission.language}</Table.Cell>
                  <Table.Cell><span className={`status icn ${submission.status}`} /></Table.Cell>
                  <Table.Cell>{Math.floor(submission.runtime)}</Table.Cell>
                  <Table.Cell><Moment fromNow date={submission.date * 1000} /> </Table.Cell>
                  <Table.Cell>{submission.score}</Table.Cell>
                </Table.Row>)
              ) :
                <Table.Row>
                  <Table.Cell colSpan={10} style={{ textAlign: "center" }}>No Submissions</Table.Cell>
                </Table.Row>
              }
            </Table.Body>
          </Table>
        }
      </Block>
    </>
  )
}

export default Submissions