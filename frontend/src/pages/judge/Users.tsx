import { User } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'semantic-ui-react'
import config from 'environment'
import { AppContext } from 'context'
import { PageLoading, StatusMessage } from 'components'
import { usePageTitle } from 'hooks'
import {Button} from 'semantic-ui-react'

type SortKey = 'uid' | 'display_name' | 'username' | 'role' | 'division' | 'school'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Teams = (): React.JSX.Element => {
  usePageTitle("Abacus | Users")

  const { user } = useContext(AppContext)

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'username',
    direction: 'ascending'
  })

  const[currentPage, setCurrentPage] = useState<number>(1)

  const sort = (newColumn: SortKey, users_list: User[] = users) => {
    const newDirection = column === newColumn && direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setUsers(
      users_list.sort(
        (u1: User, u2: User) =>
          (u1[newColumn] || 'ZZ').localeCompare(u2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  useEffect(() => {
    loadUsers(currentPage)
    }, [currentPage])

  const loadUsers = async (page: number) => {
    try {
      const response = await fetch(`${config.API_URL}/users?division=${user?.division}&role=team&page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
        const data = Object.values(await response.json()) as User[]
        sort('username', data.map((user) => ({...user, checked: false}))
      )
        setLoading(false)
    } catch (err) {
      setError(err as string)
    }
  }

  if (isLoading) return <PageLoading />
  if (error) return <StatusMessage message={{ type: 'error', message: error }} />

  return <Table sortable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          sorted={column === 'username' ? direction : undefined}
          onClick={() => sort('username')}
          content="Username"
        />
        <Table.HeaderCell
          sorted={column === 'display_name' ? direction : undefined}
          onClick={() => sort('display_name')}
          content="Display Name"
        />
        <Table.HeaderCell
          sorted={column === 'school' ? direction : undefined}
          onClick={() => sort('school')}
          content="School"
        />
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {users.map((team: User) => {
        return (
          <Table.Row key={team.uid} uuid={`${team.uid}`}>
            <Table.Cell>{team.username}</Table.Cell>
            <Table.Cell>{team.display_name}</Table.Cell>
            <Table.Cell>{team.school}</Table.Cell>
          </Table.Row>
        )
      })}
    </Table.Body>
    <Button
            content="Previous Page"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} // Decrease page number but not below 1
            disabled={currentPage <= 1} // Disable button if on the first page
          />
          <Button 
            content="Next Page" 
            onClick={() => setCurrentPage(prev => prev + 1)} // Increment page number
          />
  </Table>
}

export default Teams
