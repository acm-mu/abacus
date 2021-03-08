import React, { useState, useEffect } from 'react'
import { Table, Button, Loader, ButtonGroup, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Block } from '../../../components'
import config from '../../../environment'
import { Problem, Submission } from 'abacus'

interface ProblemItem extends Problem {
  checked: boolean
}

const Problems = (): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [submissions, setSubmissions] = useState<{ [key: string]: Submission[] }>()
  const [isMounted, setMounted] = useState<boolean>(true)

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=blue`, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const problems: Problem[] = Object.values(data)
          problems.sort((a: Problem, b: Problem) => a.id.localeCompare(b.id))
          setProblems(problems.map(problem => ({ ...problem, checked: false })))
          setLoading(false)
        }
      })

    fetch(`${config.API_URL}/submissions?division=blue`, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const submissions: Submission[] = Object.values(data)
          const subs: { [key: string]: Submission[] } = {}
          submissions.forEach((sub: Submission) => {
            const { pid } = sub;
            if (!(pid in subs)) subs[pid] = []
            subs[pid].push(sub)
          })
          setSubmissions(subs)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProblems(problems.map(problem => problem.pid == event.target.id ? { ...problem, checked: !problem.checked } : problem))
  }

  const checkAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProblems(problems.map(problem => ({ ...problem, checked: event.target.checked })))
  }

  const deleteSelected = () => {
    const problemsToDelete = problems.filter(problem => problem.checked).map(problem => problem.pid)
    fetch(`${config.API_URL}/problems`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pid: problemsToDelete })
    }).then(res => {
      if (res.status == 200) {
        setProblems(problems.filter(problem => !problemsToDelete.includes(problem.pid)))
      }
    })
  }

  return (
    <Block size='xs-12' transparent>
      <ButtonGroup>
        <Popup content='Add Problem' trigger={<Button as={Link} to='/admin/problems/new' icon='plus' />} />
        <Popup content='Import from CSV' trigger={<Link to='/admin/problems/upload'><Button icon='upload' /></Link>} />
        <Popup content='Export to JSON' trigger={<a href={`${config.API_URL}/problems.json`}><Button icon='download' /></a>} />
        {problems.filter(problem => problem.checked).length ?
          <Popup content='Delete Selected' trigger={<Button icon='trash' negative onClick={deleteSelected} />} /> : <></>}
      </ButtonGroup>
      {isLoading ?
        <Loader active inline='centered' content="Loading" /> :
        <Table celled className='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
              <Table.HeaderCell collapsing>ID</Table.HeaderCell>
              <Table.HeaderCell>Problem Name</Table.HeaderCell>
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
                {submissions &&
                  <>
                    <Table.Cell>{problem.pid in submissions ? submissions[problem.pid].filter((p) => p.score > 0).length : 0}</Table.Cell>
                    <Table.Cell>{problem.pid in submissions ? submissions[problem.pid].length : 0}</Table.Cell>
                  </>
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      }
    </Block>
  )
}

export default Problems