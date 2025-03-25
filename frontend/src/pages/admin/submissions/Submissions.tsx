import { Submission } from 'abacus'
import { Block, DivisionLabel, PageLoading } from 'components'
import { SocketContext } from 'context'
import config from 'environment'
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Grid, Label, Menu, MenuItemProps, Table } from 'semantic-ui-react'
import { compare } from 'utils'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'

interface SubmissionItem extends Submission {
  checked: boolean
}
type SortKey = 'date' | 'sid' | 'sub_no' | 'language' | 'status' | 'runtime' | 'score'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Submissions = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Submissions")

  const socket = useContext(SocketContext)
  const [isLoading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [isDeleting, setDeleting] = useState(false)
  const [showReleased, setShowReleased] = useState(false)
  const [activeDivision, setActiveDivision] = useState('blue')

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  const[currentPage, setCurrentPage] = useState<number>(1) //pagination change setup

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
    loadSubmissions(currentPage).then(() => setLoading(false))
    socket?.on('new_submission', () => loadSubmissions(currentPage))
    socket?.on('update_submission', () => loadSubmissions(currentPage))
  }, [currentPage])

  /*
  @param page - page to query when paginating
  updates the new page of submissions
  */
  const loadSubmissions = async (page: number) => {
    //include page as query, so that API can fetch it.
    const response = await fetch(`${config.API_URL}/submissions?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    const newSubmissions = Object.values(await response.json()) as SubmissionItem[]
    setSubmissions(newSubmissions.map((submission) => ({ ...submission, checked: false })))
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
    if (window.confirm('are you sure you want to delete these submissions?')) {
      //if the user selects ok, then the code below runs, otherwise nothing occurs
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
        //tells the toast container below to display a message saying 'Deleted selected submissions'
        const id = submissionsToDelete.join()
        window.sendNotification({
          id,
          type: 'success',
          header: 'Success!',
          content: 'We deleted the submissions you selected!'
        })
      }
      loadSubmissions(currentPage)
      setDeleting(false)
    }
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
    <Grid>
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
      </Block>
      <Button
        content="Previous Page"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        disabled={currentPage <= 1} 
      />
      <Button
        content="Next Page"
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={submissions.length < 25} //only gives pages with existing entries (edge case bug if page has exactly 25)
      />

    </Grid>
  )
}

export default Submissions
