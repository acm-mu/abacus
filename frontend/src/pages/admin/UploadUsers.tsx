import { createHash } from 'crypto';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Label, Table } from 'semantic-ui-react';
import { Block, FileDialog } from '../../components';
import config from "../../environment"
import { UserType } from '../../types';

interface UserItem extends UserType {
  checked: boolean
}

const UploadUsers = (): JSX.Element => {
  const history = useHistory()
  const [file, setFile] = useState<File>()
  const [users, setUsers] = useState<{ [key: string]: UserType }>({})
  const [newUsers, setNewUsers] = useState<UserItem[]>([])

  const uploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.length) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string
        if (text)
          setNewUsers(JSON.parse(text).map((user: UserType) => ({ ...user, checked: true })))
      }
      reader.readAsText(event.target.files[0])
      setFile(event.target.files[0])
    }
  }

  useEffect(() => {
    fetch(`${config.API_URL}/users`)
      .then(res => res.json())
      .then(res => setUsers(res))
  }, [])

  const filterUser = (u1: UserItem, u2: UserType) => {
    if (!u2) return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checked: _checked, session_token: _, ...user1 } = u1
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { session_token: st, ...user2 } = u2
    user1.password = createHash('sha256').update(user1.password).digest('hex')
    return JSON.stringify(user1, Object.keys(user1).sort()) !== JSON.stringify(user2, Object.keys(user2).sort())
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsers(newUsers.map(user => user.user_id == event.target.id ? { ...user, checked: !user.checked } : user))
  }

  const checkAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsers(newUsers.map(user => ({ ...user, checked: event.target.checked })))
  }

  const handleSubmit = async () => {
    if (newUsers) {
      for (const user of newUsers.filter(u => u.checked)) {
        await fetch(`${config.API_URL}/users`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
      }
      history.push("/admin/users")
    }
  }

  return (<Block size='xs-12' transparent>
    <h1>Upload Users</h1>

    <FileDialog file={file} onChange={uploadChange} control={(file?: File) => (
      file ?
        <>
          <h3>Your upload will include the following files:</h3>
          <ul>
            <li>{file.name} ({file.size} bytes)</li>
          </ul>
        </> : <p>
          <b>Drag & drop</b> a file here to upload <br />
          <i>(Or click and choose file)</i>
        </p>
    )} />
    {newUsers?.length ?
      <>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <input type="checkbox" onChange={checkAll} />
              </Table.HeaderCell>
              <Table.HeaderCell>User Id</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Password</Table.HeaderCell>
              <Table.HeaderCell>DisplayName</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {newUsers.filter(user => filterUser(user, users[user.user_id]))
              .map((user: UserItem, index: number) => (
                <Table.Row key={index}>
                  <Table.HeaderCell collapsing>
                    <input
                      type="checkbox"
                      checked={user.checked}
                      id={user.user_id}
                      onChange={handleChange} />
                  </Table.HeaderCell>
                  <Table.Cell>
                    {user.user_id}
                    {Object.keys(users).includes(user.user_id) ?
                      <Label color='blue' style={{ float: 'right' }}>Update User</Label> :
                      <Label color='green' style={{ float: 'right' }}>Brand New</Label>}
                  </Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.division}</Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.password}</Table.Cell>
                  <Table.Cell>{user.display_name}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <Button primary onClick={handleSubmit}>Import user(s)</Button>
      </> : <></>}
  </Block>)
}

export default UploadUsers