import { Submission } from 'abacus'
import React, { ChangeEvent, useState, useEffect, useMemo, useContext } from 'react'
import { Button, Checkbox, Label, Menu, MenuItemProps, Pagination, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import config from 'environment'
import { compare } from 'utils'
import { Helmet } from 'react-helmet'
import { Block, DivisionLabel, PageLoading } from 'components'
import { SocketContext } from 'context'

interface SubmissionItem extends Submission {
  checked: boolean
}
type SortKey = 'date' | 'sid' | 'sub_no' | 'language' | 'status' | 'runtime' | 'date' | 'score'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Submissions = (): JSX.Element => {
  const socket = useContext(SocketContext)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [isMounted, setMounted] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [numberOfPages, setNumberOfPages] = useState<number>(4)
  const [showReleased, setShowReleased] = useState(false)
  const [activeDivision, setActiveDivision] = useState('blue')

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey, submission_list: SubmissionItem[] = submissions) => {
    const newDirection = column === newColumn ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setSubmissions(
      submission_list.sort(
        (s1: Submission, s2: Submission) =>
          compare(s1[newColumn] || 'ZZ', s2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  useEffect(() => {
    loadSubmissions(page).then(() => setLoading(false))
    socket?.on('new_submission', () => loadSubmissions(page))
    socket?.on('update_submission', () => loadSubmissions(page))
    return () => setMounted(false)
  }, [])


  const handlePageChange = async (page: number) => {
    setPage(page)
    loadSubmissions(page)
  }

  const loadSubmissions = async (page: number) => {
    const response = await fetch(`${config.API_URL}/submissions?page=${page}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.accessToken}`,
      'Content-Type': 'application/json'
      },
    })
    const submissions = Object.values(await response.json()) as SubmissionItem[]
setSubmissions(submissions.map((submission) => ({ ...submission, checked: false })))
  }

  const onReleaseChange = () => setShowReleased(!showReleased)

  const downloadSubmissions = () =>
    saveAs(new File([JSON.stringify(submissions, null, '\t')], 'submissions.json', { type: 'text/json;charset=utf-8' }))

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setSubmissions(submissions.map((submission) => (submission.sid == id ? { ...submission, checked } : submission)))

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setSubmissions(
      submissions.map((submission) =>
        (!submission.released || showReleased) && submission.division == activeDivision
          ? { ...submission, checked }
          : submission
      )
    )
    

  const deleteSelected = async () => {
    setDeleting(true)
    const submissionsToDelete = submissions
      .filter((submission) => submission.checked && (!submission.released || showReleased))
      .map((submission) => submission.sid)
    const response = await fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ sid: submissionsToDelete })
    })
    if (response.ok) {
      loadSubmissions(page)
    }
    setDeleting(false)
  }

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps) =>
    name && setActiveDivision(name)

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => (!submission.released || showReleased) && submission.division == activeDivision
      ),
    [submissions, showReleased, activeDivision]
  )

  if (isLoading) return <PageLoading />

  return (
    <>
      <Helmet>
        <title>Abacus | Admin Submissions</title>
      </Helmet>
      <Button content="Download Submissions" onClick={downloadSubmissions} />
      {submissions.filter((submission) => submission.checked && submission.division == activeDivision).length ? (
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
      <Checkbox toggle label="Show Released" checked={showReleased} onClick={onReleaseChange} />

      <Block size="xs-12" transparent>
        <Menu pointing secondary>
          <Menu.Item name="blue" active={activeDivision == 'blue'} onClick={handleItemClick}>
            Blue
          </Menu.Item>
          <Menu.Item name="gold" active={activeDivision == 'gold'} onClick={handleItemClick}>
            Gold
          </Menu.Item>
          <Menu.Item name="eagle" active={activeDivision == 'eagle'} onClick={handleItemClick}>
            Eagle
          </Menu.Item>
        </Menu>

        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <input type="checkbox" onChange={checkAll} />
              </Table.HeaderCell>
              <Table.HeaderCell className="sortable" onClick={() => sort('sid')}>
                Submission ID
              </Table.HeaderCell>
              <Table.HeaderCell>Problem</Table.HeaderCell>
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell className="sortable" onClick={() => sort('status')}>
                Status
              </Table.HeaderCell>
              <Table.HeaderCell>Released</Table.HeaderCell>
              <Table.HeaderCell>Flagged</Table.HeaderCell>
              <Table.HeaderCell className="sortable" onClick={() => sort('date')}>
                Time
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredSubmissions.length == 0 ? (
              <Table.Row>
                <Table.Cell colSpan={'100%'}>No Submissions</Table.Cell>
              </Table.Row>
            ) : (
              filteredSubmissions.map((submission) => (
                <Table.Row key={submission.sid}>
                  <Table.Cell>
                    <input type="checkbox" checked={submission.checked} id={submission.sid} onChange={handleChange} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/problems/${submission.pid}`}>{submission.problem?.name} </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <DivisionLabel division={submission.division} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/users/${submission.team.uid}`}>{submission.team.display_name}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`status icn ${submission.status}`} />
                  </Table.Cell>
                  <Table.Cell>
                    {submission.released ? (
                      <Label color="green" icon="check" content="Released" />
                    ) : (
                      <Label icon="lock" content="Held" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {submission.flagged ? (
                      <Label color="orange" icon="flag" content={`Flagged: ${submission.flagged.display_name}`} />
                    ) : (
                      <Label icon="cancel" content="Unflagged" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Moment fromNow date={submission.date * 1000} />{' '}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
        <Pagination defaultActivePage={page} totalPages={numberOfPages} onPageChange={((_event, data) => handlePageChange(data.activePage as number))} />
      </Block>
    </>
  )
}

export default Submissions
