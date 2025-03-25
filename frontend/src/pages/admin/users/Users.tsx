import { User } from 'abacus'
import { PageLoading, StatusMessage } from 'components'
import CustomTable from 'components/CustomTable'
import { AppContext } from 'context'
import config from 'environment'
import { saveAs } from 'file-saver'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'
import CreateUser from './CreateUser'
import { usePageTitle } from 'hooks'

interface UserItem extends User {
  checked: boolean
}

const sortKeys = ['uid', 'display_name', 'username', 'role', 'division', 'school'] as const
type SortKey = typeof sortKeys[number]

type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Users = (): React.JSX.Element => {
  usePageTitle("Abacus | Users")
  const { user } = useContext(AppContext)

  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [isImporting, setImporting] = useState(false)
  const [error, setError] = useState<string>()
  
  // Added state to track the current page
  const [currentPage, setCurrentPage] = useState<number>(1) 

  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'username',
    direction: 'ascending'
  })

  const sort = (maybeColumn: string, users_list: UserItem[] = users) => {
    const newColumn: SortKey | undefined = sortKeys.find(value => value == maybeColumn)
    if (!newColumn) return

    const newDirection = column === newColumn && direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setUsers(
      users_list.sort(
        (u1: User, u2: User) =>
          (u1[newColumn] || 'ZZ').localeCompare(u2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  // Changed useEffect to load users based on the current page
  useEffect(() => {
    loadUsers(currentPage) // Fetch users based on currentPage
  }, [currentPage]) // Re-run this effect whenever the currentPage changes

  const loadUsers = async (page: number) => {
    try {
      // API now includes the page parameter
      const response = await fetch(`${config.API_URL}/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = Object.values(await response.json()) as UserItem[]
      sort(
        'username',
        data.map((user) => ({ ...user, checked: false }))
      )
      setLoading(false)
    } catch (err) {
      setError(err as string)
    }
  }

  const downloadUsers = () => {
    const sanitized = JSON.stringify(users as User[], null, '\t')
    saveAs(new File([sanitized], 'users.json', { type: 'text/json;charset=utf-8' }))
  }

  const importUsers = async () => {
    setImporting(true)
    const passwords = []

    try {
      const response = await fetch('https://mu.acm.org/api/registered_teams')
      const teams = await response.json()
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+'

      let i = 1

      for (const team of teams) {
        if (team.division === 'eagle') continue
        let password = ''

        for (let j = 0; j < 9; j++) password += possible.charAt(Math.floor(Math.random() * possible.length))

        const username = 'team' + i

        const res = await fetch(`${config.API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.accessToken}`
          },
          body: JSON.stringify({
            division: team.division,
            display_name: team.team_name,
            school: team.school_name,
            password,
            role: 'team',
            username
          })
        })

        if (res.ok) {
          passwords.push({
            username,
            display_name: team.team_name,
            school: team.school_name,
            division: team.division,
            password
          })
          const new_user = await res.json()
          setUsers((users) => users.concat(new_user))
        }
        i++
      }

      if (passwords.length != 0) {
        const sanitized = JSON.stringify(passwords, null, '\t')
        saveAs(new File([sanitized], 'imported_users.json', { type: 'text/json;charset=utf-8' }))
      }
    } catch (err) {
      console.log(err)
      setError(err as string)
    }
    setImporting(false)
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setUsers(users.map((user) => (user.uid == id ? { ...user, checked } : user)))

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setUsers(users.map((user) => ({ ...user, checked })))

  const createUserCallback = (response: Response) => {
    if (response.ok) loadUsers(currentPage) // Reload users when a new user is created
  }

  const deleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete these users?')) {
      if (users.filter((u) => u.checked && u.uid == user?.uid).length > 0) {
        alert('Cannot delete the currently logged-in user!')
        return
      }

      setDeleting(true)

      const usersToDelete = users.filter((user) => user.checked).map((user) => user.uid)
      const response = await fetch(`${config.API_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.accessToken}`
        },
        body: JSON.stringify({ uid: usersToDelete })
      })

      if (response.ok) {
        loadUsers(currentPage) // Reload users after deletion
        const id = usersToDelete.join()
        window.sendNotification({
          id,
          type: 'success',
          header: 'Success!',
          content: 'We deleted the users you selected!'
        })
      }

      setDeleting(false)
    }
  }

  if (isLoading) return <PageLoading />
  if (error) return <StatusMessage message={{ type: 'error', message: error }} />

  return (
    <Grid>
      <CreateUser trigger={<Button content="Add User" primary />} callback={createUserCallback} />
      <Button as={Link} to={'/admin/users/upload'} content="Upload Users" />
      <Button loading={isImporting} disabled={isImporting} content="Import Users" onClick={importUsers} />
      <Button content="Download Users" onClick={downloadUsers} />
      {users.filter((user) => user.checked).length ? (
        <Button
          loading={isDeleting}
          disabled={isDeleting}
          content="Delete Selected"
          negative
          onClick={deleteSelected}
        />
      ) : (
        <></>
      )}
      <CustomTable
        id={'uid'}
        header={['username', 'role', 'division', 'school', 'display_name']}
        body={users}
        onCheckItem={handleChange}
        sort={{ column, direction }}
        onClickHeaderItem={(item: string) => sort(item)}
        onCheckAll={checkAll}
      />
      {/* Pagination controls */}
      
      <Button
        content="Previous Page"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} // Decrease page number but not below 1
        disabled={currentPage <= 1} // Disable button if on the first page
      />
      <Button 
        content="Next Page" 
        onClick={() => setCurrentPage(prev => prev + 1)} // Increment page number
        disabled={users.length<25} //only gives pages with existing entries (edge case bug if page has exactly 25)
      />
    </Grid>
  )
}

export default Users
