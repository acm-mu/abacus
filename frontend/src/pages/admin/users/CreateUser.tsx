import type { IUser, IUserReq, NullablePartial } from "abacus"
import { ApiResponse, UserRepository } from 'api'
import { StatusMessage } from 'components'
import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Input, Modal, Select } from 'semantic-ui-react'
import { divisions, roles } from 'utils'

type CreateUserProps = {
  trigger: React.JSX.Element
  callback?: (res: ApiResponse<any>) => void
}

const CreateUser = ({ trigger, callback }: CreateUserProps): React.JSX.Element => {
  const userRepo = new UserRepository()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [user, setUser] = useState<IUserReq>()
  const [isCreating, setCreating] = useState(false)

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [name]: value } as IUserReq)
  }
  const handleSelectChange = (_: never, { name, value }: HTMLInputElement) => {
    setUser({ ...user, [name]: value } as IUserReq)
  }

  const handleSubmit = async () => {
    if (!user) return

    setCreating(true)

    const response = await userRepo.create(user)

    callback && callback(response)

    if (response.ok) {
      setOpen(false)
    } else {
      setError(response.errors)
    }

    setCreating(false)
  }

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => {
        setError(undefined)
        setUser(undefined)
        setOpen(true)
      }}
      open={open}
      trigger={trigger}>
      <Modal.Header>Create User</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {error ? <StatusMessage message={{ type: 'error', message: error }} /> : <></>}
          <Form>
            <Form.Field
              control={Input}
              onChange={handleChange}
              label="Username"
              name="username"
              value={user?.username}
              placeholder="User Name"
              required
            />
            <Form.Field
              control={Select}
              onChange={handleSelectChange}
              label="User Role"
              name="role"
              options={roles}
              value={user?.role}
              placeholder="User Role"
              required
            />
            {user?.role == 'team' && (
              <Form.Field
                control={Input}
                onChange={handleChange}
                label="School"
                name="school"
                value={user?.school}
                placeholder="School"
                required
              />
            )}
            {user?.role && ['team', 'judge'].includes(user.role) && (
              <Form.Field
                control={Select}
                onChange={handleSelectChange}
                label="Division"
                name="division"
                options={divisions}
                value={user?.division}
                placeholder="Division"
                required
              />
            )}
            <Form.Field
              control={Input}
              onChange={handleChange}
              label="Display Name"
              name="display_name"
              value={user?.display_name}
              placeholder="Display Name"
              required
            />
            <Form.Field
              control={Input}
              onChange={handleChange}
              name="password"
              label="Password"
              value={user?.password}
              type="password"
              placeholder="Password"
              required
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={handleSubmit} loading={isCreating} disabled={isCreating}>
          Create
        </Button>
        <Button
          onClick={() => {
            setOpen(false)
          }}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default CreateUser
