import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { Block } from "../components";
import { authenticate, useAuth } from '../authlib'
import { UserContext } from "../context/user";
import { Redirect } from "react-router-dom";

const Login = (): JSX.Element => {
  const { user, setUser } = useContext(UserContext)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [isAuthenticated] = useAuth(user, isMounted)
  const [error, setError] = useState<boolean>(false)
  const formData: { [any: string]: string } = {}

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formData[event.target.name] = event.target.value
  }

  const handleSubmit = async () => {
    const { username, password } = formData
    const authenticatedUser = await authenticate(username, password)
    if (authenticatedUser) {
      setUser(authenticatedUser)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    setMounted(true)
    return () => { setMounted(false) }
  }, [])

  return (
    <Block transparent center size="xs-6">
      {isAuthenticated ?
        <>
          {
            (user?.role == "admin" && <Redirect to='/admin' />) ||
            (user?.role == "team" && (
              (user?.division == "blue" && <Redirect to='/blue' />) ||
              (user?.division == "gold" && <Redirect to='/gold' />)
            ))
          }
        </> : <>
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
      }
    </Block>)
};

export default Login;
