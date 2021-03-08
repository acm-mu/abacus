import React, { ChangeEvent, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Form, Input, Menu, Message, Select } from "semantic-ui-react"
import config from '../../../environment'
import { Block } from "../../../components"
import { User } from "abacus"

const EditUser = (): JSX.Element => {
  const [user, setUser] = useState<User>()
  const [formUser, setFormUser] = useState({
    uid: '',
    username: '',
    role: '',
    division: '',
    school: '',
    display_name: '',
    password: ''
  })
  const [message, setMessage] = useState<{ type: string, message: string }>()
  const { uid } = useParams<{ uid: string }>()

  const roles = [
    { key: 'team', text: 'Team', value: 'team' },
    { key: 'judge', text: 'Judge', value: 'judge' },
    { key: 'admin', text: 'Admin', value: 'admin' }
  ]
  const divisions = [
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'gold', text: 'Gold', value: 'gold' }
  ]

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => setFormUser({ ...formUser, [name]: value })
  const handleSelectChange = (_: never, { name, value }: HTMLInputElement) => setFormUser({ ...formUser, [name]: value })

  const handleSubmit = async () => {
    const response = await fetch(`${config.API_URL}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ ...formUser, school: formUser.role == 'team' ? formUser.school : '', })
    })
    if (response.ok) {
      const body = await response.json()
      setMessage({ type: 'success', message: "User saved successfully!" })
      setUser(body)
      setFormUser({ ...body, password: '' })
    } else if (response.status == 400) {
      const body = await response.json()
      setMessage({ type: 'error', message: body.message })
    }
  }

  const [isMounted, setMounted] = useState(true)
  useEffect(() => {
    fetch(`${config.API_URL}/users?uid=${uid}`, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          data = Object.values(data)[0]
          setUser(data)
          setFormUser({ ...data, password: '' })
        }
      })
    return () => { setMounted(false) }
  }, [])

  return (
    <>
      <h1>{user?.display_name}</h1>
      <Block size='xs-12' transparent>
        {message ?
          <>
            {(() => {
              switch (message.type) {
                case 'error':
                  return <Message error icon='warning circle' header="An error has occurred!" content={message.message} />
                case 'success':
                  return <Message success icon='check' header='Success!' content={message.message} />
              }
            })()}
          </> : <></>}
        <Menu attached='top' tabular>
          <Menu.Item active>User Info</Menu.Item>
        </Menu>
        <Form style={{ padding: '20px', background: 'white', border: '1px solid #d4d4d5', borderTop: 'none' }} onSubmit={handleSubmit} >
          <h2>Edit User</h2>

          <Form.Field
            control={Input}
            onChange={handleChange}
            label='Username'
            name='username'
            value={formUser?.username}
            placeholder='User Name'
            required />
          <Form.Field
            control={Input}
            onChange={handleChange}
            label='Display Name'
            name='display_name'
            value={formUser?.display_name}
            placeholder='Display Name'
            required />
          <Form.Field
            control={Select}
            onChange={handleSelectChange}
            label='User Role'
            name='role'
            options={roles}
            value={formUser?.role}
            placeholder='User Role'
            required />
          {formUser.role == 'team' &&
            <Form.Field
              control={Input}
              onChange={handleChange}
              label='School'
              name='school'
              value={formUser?.school}
              placeholder='School'
              required />}
          <Form.Field
            control={Select}
            onChange={handleSelectChange}
            label='Division'
            name='division'
            options={divisions}
            value={formUser?.division}
            placeholder='Division'
            required />
          <Form.Field
            control={Input}
            onChange={handleChange}
            label='Password'
            name='password'
            type='password'
            value={formUser?.password}
            placeholder='Password'
            required />
          <Button primary type="submit">Save</Button>
        </Form>
      </Block>
    </>
  )
}

export default EditUser