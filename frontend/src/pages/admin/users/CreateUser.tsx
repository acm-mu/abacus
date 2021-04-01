import React, { ChangeEvent, useState } from "react"
import { Modal, Form, Input, Select, Button } from "semantic-ui-react"
import config from 'environment'
import { divisions, roles } from "utils"
import { StatusMessage } from "components"

type CreateUserProps = {
  trigger: JSX.Element;
  callback?: (res: Response) => void;
}

const CreateUser = ({ trigger, callback }: CreateUserProps): JSX.Element => {
  const empty = {
    username: '',
    role: '',
    division: '',
    school: '',
    display_name: '',
    password: ''
  }

  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState(empty)

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => setUser({ ...user, [name]: value })
  const handleSelectChange = (_: never, { name, value }: HTMLInputElement) => setUser({ ...user, [name]: value })

  const handleSubmit = async () => {
    const response = await fetch(`${config.API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ ...user, school: user.role == 'team' ? user.school : '' })
    })
    callback && callback(response)

    if (response.ok) {
      setOpen(false)
    } else {
      const body = await response.json()
      setError(body.message)
    }
  }

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => {
        setError(undefined)
        setUser(empty)
        setOpen(true)
      }}
      open={open}
      trigger={trigger}
    >
      <Modal.Header>Create User</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {error ? <StatusMessage message={{ type: 'error', message: error }} /> : <></>}
          <Form>
            <Form.Field
              control={Input}
              onChange={handleChange}
              label='Username'
              name='username'
              value={user.username}
              placeholder='User Name'
              required
            />
            <Form.Field
              control={Select}
              onChange={handleSelectChange}
              label='User Role'
              name='role'
              options={roles}
              value={user.role}
              placeholder='User Role'
              required
            />
            {user.role == 'team' &&
              <Form.Field
                control={Input}
                onChange={handleChange}
                label='School'
                name='school'
                value={user.school}
                placeholder='School'
                required
              />}
            {['team', 'judge'].includes(user.role) &&
              <Form.Field
                control={Select}
                onChange={handleSelectChange}
                label='Division'
                name='division'
                options={divisions}
                value={user.division}
                placeholder='Division'
                required />}
            <Form.Field
              control={Input}
              onChange={handleChange}
              label='Display Name'
              name='display_name'
              value={user.display_name}
              placeholder='Display Name'
              required
            />
            <Form.Field
              control={Input}
              onChange={handleChange}
              name='password'
              label='Password'
              value={user.password}
              type='password'
              placeholder='Password'
              required
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={handleSubmit}>Create</Button>
        <Button onClick={() => { setOpen(false) }}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  )
}

export default CreateUser