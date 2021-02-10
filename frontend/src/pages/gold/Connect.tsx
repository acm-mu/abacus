import React, { useContext, useState } from "react"
import { Input, Form, Button } from "semantic-ui-react"
import { Block } from "../../components"
import { UserContext } from "../../context/user"
import config from '../../environment'

const Connect = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [disabled, setDisabled] = useState(true)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
    fetch(`https://api.scratch.mit.edu/users/${event.target.value}`)
      .then(res => setDisabled(res.status != 200))
  }

  const handleSubmit = () => {
    const formData = new FormData()
    if (!user) {
      alert("You must be logged in to do that!")
      return
    }
    formData.set('user_id', user.user_id)
    formData.set('scratch_username', username)
    fetch(`${config.API_URL}/users`, {
      method: "PUT",
      body: formData
    })
  }
  return (
    <Block size='xs-12' >
      <p>You have not yet attached your Scratch® account to your profile. Please enter it below.</p>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="Scratch Username" onChange={handleChange} action={<Button content='Connect' color='orange' disabled={disabled} />} />
      </Form>
    </Block>
  )
}

export default Connect