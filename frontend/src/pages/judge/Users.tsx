import type { IUser, SortConfig } from 'abacus'
import { UserRepository } from 'api'
import { PageLoading, StatusMessage } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'semantic-ui-react'

const Teams = (): React.JSX.Element => {
  usePageTitle("Abacus | Users")

  const userRepository = new UserRepository()
  const { user } = useContext(AppContext)

  const [users, setUsers] = useState<IUser[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  const [{ sortBy, sortDirection }, setSortConfig] = useState<SortConfig<IUser>>({
    sortBy: 'username',
    sortDirection: 'ascending'
  })

  const sort = (newColumn: keyof IUser) => {
    setSortConfig({
      sortBy: newColumn,
      sortDirection: sortBy === newColumn && sortDirection === 'ascending' ? 'descending' : 'ascending'
    })
  }

  useEffect(() => {
    loadUsers().catch(console.error)
  }, [sortBy, sortDirection])

  const loadUsers = async () => {
    const response = await userRepository.getMany({
      filterBy: {
        division: user?.division,
        role: 'team'
      },
      sortBy, sortDirection
    })

    if (response.errors) {
      setError(response.errors)
    }

    if (response.ok && response.data) {
      setUsers(Object.values(response.data))
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (error) return <StatusMessage message={{ type: 'error', message: error }} />

  return <Table sortable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          sorted={sortBy === 'username' ? sortDirection : undefined}
          onClick={() => sort('username')}
          content="Username"
        />
        <Table.HeaderCell
          sorted={sortBy === 'display_name' ? sortDirection : undefined}
          onClick={() => sort('display_name')}
          content="Display Name"
        />
        <Table.HeaderCell
          sorted={sortBy === 'school' ? sortDirection : undefined}
          onClick={() => sort('school')}
          content="School"
        />
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {users.map((team: IUser) => {
        return (
          <Table.Row key={team.uid} uuid={`${team.uid}`}>
            <Table.Cell>{team.username}</Table.Cell>
            <Table.Cell>{team.display_name}</Table.Cell>
            <Table.Cell>{team.school}</Table.Cell>
          </Table.Row>
        )
      })}
    </Table.Body>
  </Table>
}

export default Teams
