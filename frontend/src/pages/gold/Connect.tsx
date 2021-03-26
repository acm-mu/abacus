import React, { ChangeEvent, useContext, useState } from "react"
import { Input, Form, Button } from "semantic-ui-react"
import AppContext from "AppContext"
import { Block } from "components"
import config from 'environment'

const Connect = (): JSX.Element => {
  const { setUser, user } = useContext(AppContext)
  const [username, setUsername] = useState<string>()
  const [disabled, setDisabled] = useState<boolean>(true)

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setUsername(value)
    fetch(`${config.API_URL}/scratch?username=${value}`)
      .then(res => setDisabled(res.status != 200))
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    if (!user) {
      alert("You must be logged in to do that!")
      return
    }
    if (!username) {
      alert("Missing username!")
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
    }
  }
  return (
    <>
      {user && <Block size='xs-12' >
        <p>You have not yet attached your Scratch® account to your profile. Please enter it below.</p>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="Scratch Username" onChange={handleChange} action={<Button content='Connect' color='orange' disabled={disabled} />} />
        </Form>
      </Block>}
    </>
  )
}

export default Connect