import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Modal } from 'semantic-ui-react'
import { AppContext } from 'context'
import fulllogo from 'assets/fulllogo.png'
import { userHome } from 'utils'
import { StatusMessage } from '.'
import {AuthService} from 'api'

interface LoginModalProps {
  trigger?: React.JSX.Element
  open?: boolean
}

const LoginModal = ({ trigger, open }: LoginModalProps): React.JSX.Element => {
  const authService = new AuthService()

  const { setUser } = useContext(AppContext)
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [isOpen, setOpen] = useState(open ?? false)
  const [isLoggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    return () => {
      setFormData({ username: '', password: '' })
      setOpen(false)
      setLoggingIn(false)
    }
  }, [])

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [name]: value })
  const handleSubmit = async () => {
    try {
      setLoggingIn(true)
      const response = await authService.login(formData.username, formData.password)

      if (response.ok) {
        const {accessToken, ...user} = response.data
        localStorage.setItem('accessToken', accessToken)
        setUser(user)
        navigate(userHome(user))
      } else {
        setError(response.errors)
      }
    } catch (err) {
      console.error(err)
    }
    setLoggingIn(false)
    setFormData({ username: '', password: '' })
  }

  return (
    <>
      <Modal
        size="tiny"
        closeIcon
        onClose={() => {
          setOpen(false)
          setFormData({ username: '', password: '' })
        }}
        onOpen={() => setOpen(true)}
        open={isOpen}
        trigger={trigger}>
        <Modal.Description>
          {error ? <StatusMessage style={{ margin: '0' }} message={{ type: 'error', message: error }} /> : <></>}
          <Form className="attached fluid segment" id="loginForm" onSubmit={handleSubmit}>
            <img src={fulllogo} width="300px" alt="Logo" style={{ paddingBottom: '10px' }} />
            <Form.Input
              label="Username"
              type="text"
              required
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <Form.Input
              label="Password"
              type="password"
              required
              value={formData.password}
              name="password"
              onChange={handleChange}
            />
            <Button type="submit" primary loading={isLoggingIn} disabled={isLoggingIn}>
              Login
            </Button>
          </Form>
        </Modal.Description>
      </Modal>
    </>
  )
}

export default LoginModal
