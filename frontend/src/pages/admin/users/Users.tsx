import type { IUser } from 'abacus'
import { UserRepository } from 'api'
import { PageLoading, StatusMessage } from 'components'
import CustomTable from 'components/CustomTable'
import { AppContext } from 'context'
import { saveAs } from 'file-saver'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'
import CreateUser from './CreateUser'

interface UserItem extends IUser {
  checked: boolean
}

const sortKeys = ['uid', 'display_name', 'username', 'role', 'division', 'school'] as const
type SortKey = typeof sortKeys[number]

type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}
/*
 <Table sortable>
        <Table.Header>
        map shit here -> 
         {users.map((user: UserItem) => (
          <Table.Row>
         {content}
          </Table.Row>
        </Table.Header>
        <Table.Body>
         map each row here -> {users.map((user: UserItem) => (
            <Table.Row key={user.uid} uuid={`${user.uid}`}>
              <Table.Cell>
                <input type="checkbox" checked={user.checked} id={user.uid} onChange={handleChange} />
              </Table.Cell>
              <Table.Cell className="space-between">
                <Link to={`/admin/users/${user.uid}`}>{user.username}</Link>
                {user.disabled && <Label color="red" content="Disabled" />}
              </Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <DivisionLabel division={user.division} />
              </Table.Cell>
              <Table.Cell>{user.school}</Table.Cell>
              <Table.Cell>{user.display_name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
*/

const Users = (): React.JSX.Element => {
  usePageTitle("Abacus | Users")

  const userRepo = new UserRepository()
  const { user } = useContext(AppContext)

  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [isImporting, setImporting] = useState(false)
  const [error, setError] = useState<string>()
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
        (u1: IUser, u2: IUser) =>
          (u1[newColumn] || 'ZZ').localeCompare(u2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  useEffect(() => {
    loadUsers()
  }, [])

  /*
  @param page - page to query when paginating
  updates the new page of users.
  */
  const loadUsers = async () => {
    try {
      //include page as query, so that API can fetch it.
      const userRepository = new UserRepository()
      const response = await userRepository.getMany()
      sort(
        'username',
        response.data?.map((user) => ({ ...user, checked: false }))
      )
      setLoading(false)
    } catch (err) {
      setError(err as string)
    }
  }

  const downloadUsers = () => {
    const sanitized = JSON.stringify(users as IUser[], null, '\t')
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

        const response = await userRepo.create({
          division: team.division,
          display_name: team.team_name,
          school: team.school,
          password,
          role: 'team',
          username
        })

        if (response.ok && response.data) {
          passwords.push({
            username,
            display_name: team.team_name,
            school: team.school_name,
            division: team.division,
            password
          })
          setUsers((users) => users.concat(response.data))
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
    if (response.ok) loadUsers()
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
      const response = await userRepo.delete(usersToDelete)

      if (response.ok) {
        loadUsers()
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
    </Grid>
  )
}

export default Users
