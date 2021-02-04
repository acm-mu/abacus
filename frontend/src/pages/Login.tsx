import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { Block } from "../components";
import { isAuthenticated, authenticate } from '../authlib'
import { useHistory } from "react-router-dom";

const Login = (): JSX.Element => {
  const [error, setError] = useState(false)
  const formData: { [any: string]: string } = {}
  const history = useHistory()

  const handleChange = (event: any) => {
    formData[event.target.name] = event.target.value
  }

  const handleSubmit = async () => {
    const { username, password } = formData
    const result = await authenticate(username, password)
    if (result)
      history.push('/')
    else
      setError(true)
  }

  return (
    <Block transparent center size="xs-6">
      {isAuthenticated() ?
        (<h3> You are already logged in!</h3 >) :
        (
          <>
            {error && <Message attached
              error
              icon="warning sign"
              content="Could not log in given provided credentials!"
            />}
            <Form className='attached fluid segment' id="loginForm" onSubmit={handleSubmit}>
              <img src="/images/fulllogo.png" width="300px" alt="Logo" />

              <Form.Input
                label="Username"
                type="text"
                required
                onChange={handleChange}
                name="username"
              />
              <Form.Input
                label="Password"
                type="password"
                required
                name="password"
                onChange={handleChange}
              />
              <Button type="submit" primary> Login</Button>
            </Form>
          </>
        )
      }
    </Block>)
};

export default Login;
