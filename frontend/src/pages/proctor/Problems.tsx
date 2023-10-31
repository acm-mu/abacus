import type { IProblem, SortConfig } from 'abacus'
import { ProblemRepository } from 'api'
import { Block, PageLoading } from 'components'
import { usePageTitle } from 'hooks'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

const Problems = (): React.JSX.Element => {
  usePageTitle("Abacus | Proctor Problems")

  const problemRepo = new ProblemRepository()

  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<IProblem[]>()

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
    loadProblems()
      .catch(console.error)
  }, [sortBy, sortDirection])

  const loadProblems = async () => {
    const response = await problemRepo.getMany({
      filterBy: {
        division: 'blue'
      },
      sortBy, sortDirection
    })

    if (response.ok && response.data) {
      setProblems(Object.values(response.data))
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <Block size="xs-12" transparent>
        <Table sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={sortBy === 'id' ? sortDirection : undefined}
                onClick={() => sort('id')}
                content="ID"
              />
              <Table.HeaderCell
                sorted={sortBy === 'name' ? sortDirection : undefined}
                onClick={() => sort('name')}
                content="Problem Name"
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!problems?.length ? <>
                <Table.Row>
                  <Table.Cell colSpan={'100%'} style={{ textAlign: 'center' }}>
                    No Problems
                  </Table.Cell>
                </Table.Row>
              </> :
              problems.map(problem =>
                <Table.Row key={`proctor-problem-table-${problem.pid}`}>
                  <Table.Cell>
                    <Link to={`/proctor/problems/${problem.pid}`}>{problem.id}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/proctor/problems/${problem.pid}`}>{problem.name}</Link>
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Problems
