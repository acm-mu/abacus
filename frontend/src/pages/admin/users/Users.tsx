import { User } from 'abacus'
import { DivisionLabel, PageLoading, StatusMessage } from 'components'
import CustomTable from 'components/CustomTable'
import { AppContext } from 'context'
import config from 'environment'
import { saveAs } from 'file-saver'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Button, Grid, Label, Pagination, Table } from 'semantic-ui-react'
import CreateUser from './CreateUser'

interface UserItem extends User {
  checked: boolean
}
type SortKey = 'uid' | 'display_name' | 'username' | 'role' | 'division' | 'school'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Users = (): JSX.Element => {
  const { user } = useContext(AppContext)

  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [isImporting, setImporting] = useState(false)
  const [error, setError] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const [numberOfPages, setNumberOfPages] = useState<number>(4)
  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'username',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey, users_list: UserItem[] = users) => {
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
    loadUsers(page)
  }, [page])

  /*
  @param page - page to query when paginating
  updates the new page of users.
  */
  const loadUsers = async (page: number) => {
    try {
      const getTableSize = async () => {
        const tableSizeRes = await fetch(`${config.API_URL}/tablesize?tablename=user`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        const numberOfPages = await tableSizeRes.json()
        const { tableSize } = numberOfPages

        setNumberOfPages(Math.ceil(tableSize))
        if (tableSize < numberOfPages) {
          setPage(numberOfPages)
        }
      }
      if (users.length !== 0) {
        getTableSize()
      }
      //include page as query, so that API can fetch it.
      const response = await fetch(`${config.API_URL}/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = Object.values(await response.json()) as UserItem[]
      if (users.length === 0 && data.length > 0) {
        getTableSize()
      } else if (users.length === 0 && data.length === 0) {
        setNumberOfPages(0)
      }
      sort(
        'username',
        data.map((user) => ({ ...user, checked: false }))
      )
      setLoading(false)
    } catch (err) {
      setError(err as string)
    }
  }

  const handlePageChange = async (newPage: number) => {
    setPage(newPage)
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

      let i = 1

      for (const team of teams) {
        if (team.division === 'eagle') continue
        const password = await (
          await fetch('https://www.passwordrandom.com/query?command=password&scheme=rrVNvNRRNN')
        ).text()

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
            display_name: team.team_name,
            username,
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
    if (response.ok) loadUsers(page)
  }

  const deleteSelected = async () => {
    if (window.confirm('are you sure you want to delete these users?')) {
      //if the user selects ok, then the code below runs, otherwise nothing occurs
      if (users.filter((u) => u.checked && u.uid == user?.uid).length > 0) {
        alert('Cannot delete currently logged in user!')
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
        loadUsers(page)
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
      <Helmet>
        <title>Abacus | Users</title>
      </Helmet>
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
  <CustomTable id={'uid'} header={['username','role','division','school','display_name']} body={users} onCheckItem={({ target: { id, checked } }) => handleChange} sort={{column, direction}} onClickHeaderItem={(item: any) => sort(item)} onCheckAll={checkAll} />
      <Pagination
        defaultActivePage={page}
        totalPages={numberOfPages}
        onPageChange={(event, data) => handlePageChange(data.activePage as number)}
      />
    </Grid>
  )
}

export default Users
