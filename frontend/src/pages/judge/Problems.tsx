import type { IBlueProblem, IProblem, ISubmission, SortConfig } from 'abacus'
import { ProblemRepository, SubmissionRepository } from 'api'
import { Block, PageLoading } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

const Problems = (): React.JSX.Element => {
  usePageTitle("Abacus | Judge Problems")

  const submissionRepo = new SubmissionRepository()
  const problemRepo = new ProblemRepository()

  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<IProblem[]>()
  const [submissions, setSubmissions] = useState<{ [key: string]: ISubmission[] }>()

  const { user } = useContext(AppContext)

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
    const response = await problemRepo.getMany({
      filterBy: {
        division: user?.division
      },
      sortBy, sortDirection
    })

    if (response.ok && response.data) {
      setProblems(Object.values(response.data))

      const submissionsResponse = await submissionRepo.getMany()

      const subs: { [key: string]: ISubmission[] } = {}

      if (submissionsResponse.data) {
        Object.values(submissionsResponse.data).forEach((sub: ISubmission) => {
          const { pid } = sub
          if (!(pid in subs)) subs[pid] = []
          subs[pid].push(sub)
        })
      }

      setSubmissions(subs)
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />

  return <Block size="xs-12" transparent>
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
          <Table.HeaderCell># of Tests</Table.HeaderCell>
          <Table.HeaderCell>Solved Attempts</Table.HeaderCell>
          <Table.HeaderCell>Total Attempts</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {problems?.length == 0 ? (
          <Table.Row>
            <Table.Cell colSpan={'100%'} style={{ textAlign: 'center' }}>
              No Problems
            </Table.Cell>
          </Table.Row>
        ) : (
          problems?.map((problem: IProblem, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  <Link to={`/judge/problems/${problem.pid}`}>{problem.id}</Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/judge/problems/${problem.pid}`}>{problem.name}</Link>
                </Table.Cell>
                <Table.Cell>{'test' in problem ? (problem as IBlueProblem).tests?.length : 0}</Table.Cell>
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
          })
        )}
      </Table.Body>
    </Table>
  </Block>
}

export default Problems
