import { Table, Button, Popup, Loader, ButtonGroup } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Block } from '../../components'
import { UserType } from '../../types'
import config from '../../environment'
import CreateUser from './CreateUser'

interface UserItem extends UserType {
  checked: boolean
}

const Users = (): JSX.Element => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMounted, setMounted] = useState<boolean>(false)

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
          <Popup content="Import from CSV" trigger={<Button icon="upload" />} />
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
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Division</Table.HeaderCell>
                <Table.HeaderCell>Displayname</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user: UserItem, index: number) =>
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