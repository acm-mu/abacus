import { Table, Button, Popup, Loader, ButtonGroup } from 'semantic-ui-react'
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Block } from '../../components'
import config from '../../environment'
import CreateUser from './CreateUser'
import { User } from 'abacus'
import AppContext from '../../AppContext'
interface UserItem extends User {
  checked: boolean
}

type SortKey = 'uid' | 'display_name' | 'username' | 'role' | 'division' | 'school'

const Users = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMounted, setMounted] = useState<boolean>(true)
  const [{ column, direction }, setSortConfig] = useState<{ column: SortKey, direction: 'ascending' | 'descending' }>({
    column: 'username',
    direction: 'ascending'
  })

  const sort = (newColumn: SortKey) => {
    const newDirection = column === newColumn && direction === 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })

    setUsers(users.sort((u1: User, u2: User) =>
      (u1[newColumn] || 'ZZ').localeCompare(u2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
    ))
  }

  useEffect(() => {
    loadUsers()
    return () => { setMounted(false) }
  }, [isMounted])

  const loadUsers = async () => {
    try {
      const res = await fetch(`${config.API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      const data = await res.json()
      if (isMounted) {
        setUsers((Object.values(data) as User[])
          .map(user => ({ ...user, checked: false }))
          .sort((ul: User, u2: User) => (ul.username.localeCompare(u2.username))))
        setLoading(false)
      }
    } catch (err) {
      return
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers(users.map(user => user.uid == event.target.id ? { ...user, checked: !user.checked } : user))
  }

  const checkAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers(users.map(user => ({ ...user, checked: event.target.checked })))
  }

  const createUserCallback = (response: Response) => {
    if (response.status == 200)
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

  return (
    <>
      <Block size='xs-12' transparent>
        <ButtonGroup>
          <Popup content="Add User" trigger={<CreateUser trigger={<Button icon="plus" />} callback={createUserCallback} />} />
          <Popup content="Import from CSV" trigger={<Link to='/admin/users/upload'><Button icon="upload" /></Link>} />
          <Popup content="Export to JSON" trigger={<a href={`${config.API_URL}/users.json`}><Button icon="download" /></a>} />
          {users.filter(user => user.checked).length ?
            <Popup content="Delete Selected" trigger={<Button icon="trash" negative onClick={deleteSelected} />} /> : <></>}
        </ButtonGroup>
        {isLoading ?
          <Loader active inline='centered' content="Loading" /> :
          <Table sortable celled>
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
              {users.map((user: UserItem, index: number) =>
                <Table.Row key={index} uuid={`${user.uid}`}>
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
        }
      </Block>
    </>
  )
}

export default Users