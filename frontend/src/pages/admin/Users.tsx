import { Table, Button, Popup, Modal, Form, Input, Select, Loader } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Block, Countdown } from '../../components'
import { UserType } from '../../types'
import config from '../../environment'

interface EditUserProps {
  user?: UserType;
  trigger: JSX.Element;
}

const EditUser = ({ user, trigger }: EditUserProps) => {
  const [open, setOpen] = useState(false)

  const roles = [
    { key: 'team', text: 'Team', value: 'team' },
    { key: 'judge', text: 'Judge', value: 'judge' },
    { key: 'admin', text: 'Admin', value: 'admin' }
  ]
  const divisions = [
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'gold', text: 'Gold', value: 'gold' },
    { key: 'na', text: 'N/A', value: 'na' }
  ]

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    // trigger={}
    >
      <Modal.Header>{user ? 'Edit User' : 'Create User'}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field
              control={Input}
              label='Username'
              value={user?.username}
              placeholder='User Name'
              required
            />
            <Form.Field
              control={Select}
              label='User Role'
              options={roles}
              value={user?.role}
              placeholder='User Role'
              required
            />
            <Form.Field
              control={Select}
              label='Division'
              options={divisions}
              value={user?.division}
              placeholder='Divisions'
              required
            />
            <Form.Field
              control={Input}
              label='Display Name'
              value={user?.display_name}
              placeholder='Display Name'
              required
            />
            <Form.Field
              control={Input}
              label='Password'
              type='password'
              placeholder='Password'
              required
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button color='red'>
          Delete
        </Button>
        <Button color='green'>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

const Users = (): JSX.Element => {
  const [users, setUsers] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect((): void => {
    fetch(`${config.API_URL}/v1/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(Object.values(data))
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Countdown />
      <Block size='xs-12' transparent>
        <div className="ui buttons">
          <Popup content="Add User" trigger={<EditUser trigger={<Button icon="plus" />} />} />
          <Popup content="Import from CSV" trigger={<Button icon="upload" />} />
          <Popup content="Export to CSV" trigger={<Button icon="download" />} />
          <Popup content="Delete Selected" trigger={<Button icon="trash" />} />

          {/* <div class="ui icon button" onclick="createTeam()" data-tooltip="Add User"><i className="plus icon"></i></div>
        <div class="ui icon button" onclick="uploadCSV()" data-tooltip="Import from CSV"><i className="upload icon"></i></div>
        <div class="ui icon button" onclick="downloadCSV()" data-tooltip="Export to CSV"><i className="download icon"></i></div>
        <div class="ui red icon button" onclick="deleteSelected()" data-tooltip="Delete Selected" id="delete_selected" style={{display: "none"}}><i className="trash icon"></i></div> */}
        </div>
        {isLoading ?
          <Loader active inline='centered' content="Loading" /> :
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing><input type='checkbox' id='select_all' /></Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Division</Table.HeaderCell>
                <Table.HeaderCell>Displayname</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user: UserType, index: number) =>
                <Table.Row key={index} uuid={`${user.user_id}`}>
                  <Table.Cell><input type='checkbox' autoComplete="off" /></Table.Cell>
                  <Table.Cell><EditUser user={user} trigger={<Link to='#'>{user.username}</Link>} /></Table.Cell>
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