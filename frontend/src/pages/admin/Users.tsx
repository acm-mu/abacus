import { Table, Button, Popup, Loader, ButtonGroup, Label } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Block } from '../../components'
import { UserType } from '../../types'
import config from '../../environment'
import CreateUser from './CreateUser'

interface UserItem extends UserType {
  checked: boolean
}

type SortKey = 'user_id' | 'display_name' | 'username' | 'role' | 'division'

const Users = (): JSX.Element => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({
    key: 'username',
    direction: 'ascending'
  })

  const sort = (key: SortKey) => {
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      setSortConfig({ key, direction: 'descending' })
    else
      setSortConfig({ key, direction: 'ascending' })
  }

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/users`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const users: UserType[] = Object.values(data)
          setUsers(users.map(user => ({ ...user, checked: false })))
          setLoading(false)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers(users.map(user => user.user_id == event.target.id ? { ...user, checked: !user.checked } : user))
  }

  const checkAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers(users.map(user => ({ ...user, checked: event.target.checked })))
  }

  const deleteSelected = () => {
    const usersToDelete = users.filter(user => user.checked).map(user => user.user_id)
    fetch(`${config.API_URL}/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: usersToDelete })
    }).then(res => {
      if (res.status == 200) {
        setUsers(users.filter(user => !usersToDelete.includes(user.user_id)))
      }
    })
  }

  return (
    <>
      <Block size='xs-12' transparent>
        <ButtonGroup>
          <Popup content="Add User" trigger={<CreateUser trigger={<Button icon="plus" />} />} />
          <Popup content="Import from CSV" trigger={<Link to='/admin/users/upload'><Button icon="upload" /></Link>} />
          <Popup content="Export to JSON" trigger={<a href={`${config.API_URL}/users.json`}><Button icon="download" /></a>} />
          {users.filter(user => user.checked).length ?
            <Popup content="Delete Selected" trigger={<Button icon="trash" negative onClick={deleteSelected} />} /> : <></>}
        </ButtonGroup>
        {isLoading ?
          <Loader active inline='centered' content="Loading" /> :
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing><input type='checkbox' onChange={checkAll} /></Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('username')}>Username</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('role')}>Role</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('division')}>Division</Table.HeaderCell>
                <Table.HeaderCell className='sortable' onClick={() => sort('display_name')}>Displayname</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.sort(
                (u1: UserType, u2: UserType) => u1[sortConfig.key].localeCompare(u2[sortConfig.key]) * (sortConfig.direction == 'ascending' ? 1 : -1))
                .map((user: UserItem, index: number) =>
                  <Table.Row key={index} uuid={`${user.user_id}`}>
                    <Table.Cell>
                      <input
                        type='checkbox'
                        checked={user.checked}
                        id={user.user_id}
                        onChange={handleChange} />
                    </Table.Cell>
                    <Table.Cell><Link to={`/admin/users/${user.user_id}`}>{user.username}</Link></Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.division}</Table.Cell>
                    <Table.Cell>{user.display_name} {user.school && <Label style={{ float: 'right' }} content={user.school} />}</Table.Cell>
                  </Table.Row>)}
            </Table.Body>
          </Table>
        }
      </Block>
    </>
  )
}

export default Users