import { Problem, Submission } from 'abacus'
import React, { ChangeEvent, useState, useEffect } from 'react'
import { Table, Button, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import config from 'environment'
import { Helmet } from 'react-helmet'

interface ProblemItem extends Problem {
  checked: boolean
}
type SortKey = 'id' | 'name'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Problems = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [submissions, setSubmissions] = useState<{ [key: string]: Submission[] }>()
  const [isMounted, setMounted] = useState<boolean>(true)

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'id',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey, problem_list: ProblemItem[] = problems) => {
    const newDirection = column === newColumn && direction == 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setProblems(problem_list.sort((p1: Problem, p2: Problem) =>
      (p1[newColumn] || 'ZZ').localeCompare(p2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1
      )))
  }

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  const loadProblems = async () => {
    let response = await fetch(`${config.API_URL}/problems?division=blue&columns=tests`, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (response.ok) {
      const problems = Object.values(await response.json()) as ProblemItem[]

      if (!isMounted) return

      sort('id', problems.map(problem => ({ ...problem, checked: false })))

      response = await fetch(`${config.API_URL}/submissions?division=blue`, {
        headers: {
          authorization: `Bearer ${localStorage.accessToken}`
        }
      })

      if (!isMounted) return

      const submissions = Object.values(await response.json()) as Submission[]
      const subs: { [key: string]: Submission[] } = {}
      submissions.forEach((sub: Submission) => {
        const { pid } = sub;
        if (!(pid in subs)) subs[pid] = []
        subs[pid].push(sub)
      })
      setSubmissions(subs)
    } else {
      setProblems([])
      setSubmissions({})
    }
    setLoading(false)
  }

  const downloadProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?columns=description,skeletons,solutions,tests`)
    if (response.ok) {
      const problems = await response.json()
      saveAs(new File([JSON.stringify(problems, null, '\t')], 'problems.json', { type: 'text/json;charset=utf-8' }))
    }
  }
  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => setProblems(problems.map(problem => problem.pid == id ? { ...problem, checked } : problem))
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => setProblems(problems.map(problem => ({ ...problem, checked })))

  const deleteSelected = async () => {
    const problemsToDelete = problems.filter(problem => problem.checked).map(problem => problem.pid)
    const response = await fetch(`${config.API_URL}/problems`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ pid: problemsToDelete })
    })
    if (response.ok) {
      setProblems(problems.filter(problem => !problemsToDelete.includes(problem.pid)))
    }
  }

  if (isLoading) return <Loader active inline='centered' content="Loading..." />

  return <>
    <Helmet>
      <title>Abacus | Admin Problems</title>
    </Helmet>

    <Button as={Link} to='/admin/problems/new' primary content="Add Problem" />
    <Link to='/admin/problems/upload'><Button content="Upload Problems" /></Link>
    <Button content="Download Problems" onClick={downloadProblems} />
    {problems.filter(problem => problem.checked).length ?
      <Button content="Delete Selected" negative onClick={deleteSelected} /> : <></>}

    <Table sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'id' ? direction : undefined}
            onClick={() => sort('id')}
            content="ID" />
          <Table.HeaderCell
            sorted={column === 'name' ? direction : undefined}
            onClick={() => sort('name')}
            content="Problem Name" />
          <Table.HeaderCell># of Tests</Table.HeaderCell>
          <Table.HeaderCell>Solved Attempts</Table.HeaderCell>
          <Table.HeaderCell>Total Attempts</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {problems.map((problem: ProblemItem, index: number) => (
          <Table.Row key={index}>
            <Table.Cell>
              <input
                type='checkbox'
                checked={problem.checked}
                id={problem.pid}
                onChange={handleChange} />
            </Table.Cell>
            <Table.Cell><Link to={`/admin/problems/${problem.pid}`}>{problem.id}</Link></Table.Cell>
            <Table.Cell><Link to={`/admin/problems/${problem.pid}`}>{problem.name}</Link></Table.Cell>
            <Table.Cell>{problem.tests?.length}</Table.Cell>
            {submissions && <>
              <Table.Cell>{problem.pid in submissions ? submissions[problem.pid].filter((p) => p.score > 0).length : 0}</Table.Cell>
              <Table.Cell>{problem.pid in submissions ? submissions[problem.pid].length : 0}</Table.Cell>
            </>}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </>
}

export default Problems