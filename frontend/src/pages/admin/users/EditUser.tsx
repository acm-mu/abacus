import type { IUser } from 'abacus'
import { UserRepository } from 'api'
import { Block, NotFound, PageLoading } from 'components'
import StatusMessage, { StatusMessageType } from 'components/StatusMessage'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Checkbox, CheckboxProps, Form, Input, Label, Menu, Select } from 'semantic-ui-react'
import { divisions, roles } from 'utils'

const EditUser = (): React.JSX.Element => {
  usePageTitle("Abacus | Edit User")

  const userRepo = new UserRepository()

  const [user, setUser] = useState<IUser>()
  const [formUser, setFormUser] = useState<IUser>({
    uid: '',
    username: '',
    role: '',
    division: '',
    school: '',
    display_name: '',
    password: ''
  })
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState<StatusMessageType>()
  const { uid } = useParams<{ uid: string }>()

  const navigate = useNavigate()

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
    setFormUser({ ...formUser, [name]: value })
  const handleSelectChange = (_: never, { name, value }: HTMLInputElement) =>
    setFormUser({ ...formUser, [name]: value })
  const handleCheckboxChange = async (_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) => {
    if (!uid) return
    setSaving(true)
    const response = await userRepo.update(uid, { disabled: checked })

    if (response.ok) {
      await loadUser()
    } else {
      setFormUser({ ...formUser, disabled: !checked })
    }

    setSaving(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    const response = await userRepo.update(formUser.uid,
      {
        ...formUser,
        school: formUser.role === 'team' ? formUser.school : ''
      })

    if (response.ok) {
      setMessage({ type: 'success', message: 'User saved successfully!' })
      setUser(response.data)
      setFormUser({ ...response.data, password: '' })
    } else {
      setMessage({ type: 'error', message: response.errors })
    }
    setSaving(false)
  }

  const loadUser = async () => {
    if (!uid) return
    const response = await userRepo.get(uid)
    if (!isMounted) return

    if (response.ok && response.data) {
      setUser(response.data)
      setFormUser({ ...response.data, password: '' })
    }

    setLoading(false)
  }

  useEffect(() => {
    loadUser()
    return () => {
      setMounted(false)
    }
  }, [])

  if (isLoading) return <PageLoading />
  if (!user) return <NotFound />

  return (
    <>
      <h1 className="justify-center">
        {user.display_name}
        {user.disabled && <Label color="red">Disabled</Label>}
      </h1>
      <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />
      <Menu attached="top" tabular>
        <Menu.Item active>User Info</Menu.Item>
      </Menu>
      <Block size="xs-12" menuAttached="top">
        <Form onSubmit={handleSubmit}>
          <div className="justify-center" style={{ justifyContent: 'space-between' }}>
            <h2>Edit User</h2>

            <Checkbox
              label="Disabled"
              name="disabled"
              checked={formUser?.disabled}
              onChange={handleCheckboxChange}
              toggle
            />
          </div>
          <Form.Field
            control={Input}
            onChange={handleChange}
            label="Username"
            name="username"
            value={formUser?.username}
            placeholder="User Name"
            required
          />
          <Form.Field
            control={Input}
            onChange={handleChange}
            label="Display Name"
            name="display_name"
            value={formUser?.display_name}
            placeholder="Display Name"
            required
          />
          <Form.Field
            control={Select}
            onChange={handleSelectChange}
            label="User Role"
            name="role"
            options={roles}
            value={formUser?.role}
            placeholder="User Role"
            required
          />
          {formUser.role == 'team' && (
            <Form.Field
              control={Input}
              onChange={handleChange}
              label="School"
              name="school"
              value={formUser?.school}
              placeholder="School"
              required
            />
          )}
          {['team', 'judge'].includes(user.role) && (
            <Form.Field
              control={Select}
              onChange={handleSelectChange}
              label="Division"
              name="division"
              options={divisions}
              value={formUser?.division}
              placeholder="Division"
              required
            />
          )}
          <Form.Field
            control={Input}
            onChange={handleChange}
            label="Password"
            name="password"
            type="password"
            value={formUser?.password}
            placeholder="Password"
            required
          />
          <Button floated="right" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button floated="right" primary type="submit" loading={isSaving} disabled={isSaving}>
            Save
          </Button>
        </Form>
      </Block>
    </>
  )
}

export default EditUser
