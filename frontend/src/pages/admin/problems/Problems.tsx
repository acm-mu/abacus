import type { IBlueProblem, IGoldProblem, IProblem, ISubmission, SortConfig } from 'abacus'
import { ProblemRepository, SubmissionRepository } from 'api'
import { Block, DivisionLabel, PageLoading } from 'components'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, Menu, MenuItemProps, Table } from 'semantic-ui-react'

interface ProblemItem extends IProblem {
  checked: boolean
}

const Problems = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Problems")

  const problemRepo = new ProblemRepository()
  const submissionRepo = new SubmissionRepository()

  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<ProblemItem[]>()
  const [submissions, setSubmissions] = useState<{ [key: string]: ISubmission[] }>()
  const [isDeleting, setDeleting] = useState(false)
  const [activeDivision, setActiveDivision] = useState('blue')

  const activeProblems = useMemo(
    () => problems?.filter((problem) => problem.division == activeDivision),
    [problems, activeDivision]
  )

  const [{ sortBy, sortDirection }, setSortConfig] = useState<SortConfig<IProblem>>({
    sortBy: 'id',
    sortDirection: 'ascending'
  })

  const sort = (newColumn: keyof IProblem) => {
    setSortConfig({
      sortBy: newColumn,
      sortDirection: sortBy === newColumn && sortDirection == 'ascending' ? 'descending' : 'ascending'
    })
  }

  useEffect(() => {
    loadProblems().catch(console.error)
  }, [sortBy, sortDirection])

  const loadProblems = async () => {
    const response = await problemRepo.getMany({ sortBy: 'id' })

    if (response.ok && response.data) {
      setProblems(Object.values(response.data) as ProblemItem[])

      const submissionResponse = await submissionRepo.getMany()

      const subs: { [key: string]: ISubmission[] } = {}
      if (submissionResponse.data) {
        Object.values(submissionResponse.data).forEach((sub: ISubmission) => {
          const { pid } = sub
          if (!(pid in subs)) subs[pid] = []
          subs[pid].push(sub)
        })
      }
      setSubmissions(subs)
    }

    setLoading(false)
  }

  const downloadProblems = async () => {
    const response = await problemRepo.getMany()

    if (response.ok) {
      const sanitized = JSON.stringify(response.data, null, '\t')
      saveAs(new File([sanitized], 'problems.json', { type: 'text/json;charset=utf-8' }))
    }
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => {
    setProblems(problems?.map((problem) => (problem.pid == id ? { ...problem, checked } : problem)))
  }

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setProblems(problems?.map((problem) => (problem.division == activeDivision ? { ...problem, checked } : problem)))
  }

  const deleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete these problems?')) {
      //if the user selects ok, then the code below runs, otherwise nothing occurs
      const problemsToDelete = activeProblems?.map((problem) => problem.pid)
      if (!problemsToDelete) {
        return
      }

      setDeleting(true)

      const response = await problemRepo.delete(problemsToDelete)
      if (response.ok) {
        setProblems(problems?.filter((problem) => !problemsToDelete.includes(problem.pid)))
        const id = problemsToDelete.join()
        window.sendNotification({
          id,
          type: 'success',
          header: 'Success!',
          content: 'We deleted the problems you selected!'
        })
      }
      setDeleting(false)
    }
  }

  const handleItemClick = (_event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps) =>
    name && setActiveDivision(name)

  if (isLoading) return <PageLoading />

  return (
    <Grid>
      <Button as={Link} to="/admin/problems/new" primary content="Add Problem" />
      <Link to="/admin/problems/upload">
        <Button content="Upload Problems" />
      </Link>

      <Button content="Download Problems" onClick={downloadProblems} />
      {problems?.filter((problem) => problem.division == activeDivision && problem.checked).length ? (
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
        <Table sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <input
                  type="checkbox"
                  checked={activeProblems && !activeProblems?.filter((problem) => !problem.checked).length}
                  onChange={checkAll}
                />
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortBy === 'id' ? sortDirection : undefined}
                onClick={() => sort('id')}
                content="ID"
              />
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell
                sorted={sortBy === 'name' ? sortDirection : undefined}
                onClick={() => sort('name')}
                content="Problem Name"
              />
              <Table.HeaderCell>{activeDivision == 'blue' ? '# of Tests' : 'Max Points'}</Table.HeaderCell>
              <Table.HeaderCell>Solved Attempts</Table.HeaderCell>
              <Table.HeaderCell>Total Attempts</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!problems?.length ? (
              <Table.Row>
                <Table.Cell colSpan={'100%'} style={{ textAlign: 'center' }}>
                  No Problems
                </Table.Cell>
              </Table.Row>
            ) : (
              activeProblems?.map(problem =>
                <Table.Row key={`problem-${problem.pid}`}>
                  <Table.Cell>
                    <input type="checkbox" checked={problem.checked} id={problem.pid} onChange={handleChange} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/problems/${problem.pid}`}>{problem.id}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <DivisionLabel division={problem.division} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/problems/${problem.pid}`}>{problem.name}</Link>
                  </Table.Cell>
                  <Table.Cell>{activeDivision == 'blue' ? (problem as IProblem as IBlueProblem).tests?.length : (problem as IProblem as IGoldProblem).max_points}</Table.Cell>
                  {submissions && (
                    <>
                      <Table.Cell>
                        {problem.pid in submissions ? submissions[problem.pid].filter((p) => p.score > 0).length : 0}
                      </Table.Cell>
                      <Table.Cell>{problem.pid in submissions ? submissions[problem.pid].length : 0}</Table.Cell>
                    </>
                  )}
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      </Block>
    </Grid>
  )
}

export default Problems
