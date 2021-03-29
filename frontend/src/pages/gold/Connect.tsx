import React, { ChangeEvent, useContext, useState } from "react"
import { Input, Form, Button } from "semantic-ui-react"
import AppContext from "AppContext"
import { Block, StatusMessage } from "components"
import { StatusMessageType } from "components/StatusMessage"
import config from 'environment'

const Connect = (): JSX.Element => {
  const { setUser, user } = useContext(AppContext)

  const [username, setUsername] = useState<string>()
  const [disabled, setDisabled] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState<StatusMessageType>()

  const showMessage = (type: 'success' | 'warning' | 'error' | undefined, message: string) => {
    setMessage({ type, message })
    setTimeout(() => setMessage(undefined), 5 * 1000)
  }

  const handleChange = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setUsername(value)
    setDisabled(true)
    const response = await fetch(`${config.API_URL}/scratch?username=${value}`)
    setDisabled(response.status !== 200)
  }

  if (!user) return <></>

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData()
    if (!user) {
      showMessage('warning', "You must be logged in to do that!")
      return
    }
    if (!username) {
      showMessage('warning', "Missing username")
      return
    }
    formData.set('uid', user.uid)
    formData.set('scratch_username', username)

    const response = await fetch(`${config.API_URL}/users`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (response.ok) {
      user.scratch_username = username
      setUser({ ...user })
      showMessage('success', 'Scratch account connected successfully!')
    } else {
      showMessage('error', response.statusText)
    }
    setLoading(false)
  }

  if (message) {
    return <StatusMessage message={message} />
  }

  if (user?.role == 'team' && user.division == 'gold' && !user.scratch_username) {
    return <Block size='xs-12' >
      <p>You have not yet attached your Scratch® account to your profile. Please enter it below.</p>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Scratch Username"
          onChange={handleChange}
          action={<Button
            content='Connect'
            color='orange'
            loading={isLoading}
            disabled={isLoading || disabled} />} />
      </Form>
    </Block>
  }
  return <></>
}

export default Connect