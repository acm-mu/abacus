import { Table, Button, Loader, Message } from 'semantic-ui-react'
import React, { ChangeEvent, useState, useEffect, useContext } from 'react'
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom'
import { Block } from '../../../components'
import config from '../../../environment'
import CreateUser from './CreateUser'
import { User } from 'abacus'
import AppContext from '../../../AppContext'

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
  const [error, setError] = useState()

  const [isMounted, setMounted] = useState(true)
  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'username',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey, users_list: UserItem[] = users) => {
    const newDirection = column === newColumn && direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setUsers(users_list.sort((u1: User, u2: User) =>
      (u1[newColumn] || 'ZZ').localeCompare(u2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
    ))
  }

  useEffect(() => {
    loadUsers()
    return () => { setMounted(false) }
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch(`${config.API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      if (isMounted) {
        const data = Object.values(await response.json()) as UserItem[]
        sort('username', data.map(user => ({ ...user, checked: false })))
        setLoading(false)
      }
    } catch (err) {
      setError(err)
    }
  }

  const downloadUsers = () => saveAs(new File([JSON.stringify(users, null, '\t')], 'users.json', { type: 'text/json;charset=utf-8' }))
  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => setUsers(users.map(user => user.uid == id ? { ...user, checked } : user))
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => setUsers(users.map(user => ({ ...user, checked })))

  const createUserCallback = (response: Response) => {
    if (response.ok)
      loadUsers()
  }

  const deleteSelected = () => {
    if (users.filter(u => u.checked && u.uid == user?.uid).length > 0) {
      alert("Cannot delete currently logged in user!")
      return
    }

    const usersToDelete = users.filter(user => user.checked).map(user => user.uid)
    fetch(`${config.API_URL}/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ uid: usersToDelete })
    }).then(res => {
      if (res.status == 200) {
        setUsers(users.filter(user => !usersToDelete.includes(user.uid)))
      }
    })
  }

  if (isLoading) return <Loader active inline='centered' content="Loading..." />

  if (error) return <Message content={error} />

  return <Block size='xs-12' transparent>

    <CreateUser trigger={<Button content="Add User" primary />} callback={createUserCallback} />
    <Link to='/admin/users/upload'><Button content="Upload Users" /></Link>
    <Button content="Download Users" onClick={downloadUsers} />
    {users.filter(user => user.checked).length ?
      <Button content="Delete Selected" negative onClick={deleteSelected} /> : <></>}

    <Table sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'username' ? direction : undefined}
            onClick={() => sort('username')}
            content="Username" />
          <Table.HeaderCell
            sorted={column === 'role' ? direction : undefined}
            onClick={() => sort('role')}
            content="Role" />
          <Table.HeaderCell
            sorted={column === 'division' ? direction : undefined}
            onClick={() => sort('division')}
            content="Division" />
          <Table.HeaderCell
            sorted={column === 'school' ? direction : undefined}
            onClick={() => sort('school')}
            content="Shool" />
          <Table.HeaderCell
            sorted={column === 'display_name' ? direction : undefined}
            onClick={() => sort('display_name')}
            content="Displayname" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user: UserItem) =>
          <Table.Row key={user.uid} uuid={`${user.uid}`}>
            <Table.Cell>
              <input
                type='checkbox'
                checked={user.checked}
                id={user.uid}
                onChange={handleChange} />
            </Table.Cell>
            <Table.Cell><Link to={`/admin/users/${user.uid}`}>{user.username}</Link></Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>{user.division}</Table.Cell>
            <Table.Cell>{user.school}</Table.Cell>
            <Table.Cell>{user.display_name}</Table.Cell>
          </Table.Row>)}
      </Table.Body>
    </Table>
  </Block>
}

export default Users