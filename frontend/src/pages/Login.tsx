import React from "react";
import { Button, Form } from "semantic-ui-react";
import { Block } from "../components";

const loginUser = async (credentials: { [key: string]: string }) => {
  const formData = new FormData();
  formData.append("user-name", credentials.username);
  formData.append("password", credentials.password);

  return fetch("http://api.codeabac.us/v1/login", {
    method: "POST",
    body: formData,
  }).then((data) => data.json());
};

/* My hunch for how hooks work, like the useToken we created. `setToken` will only
initiate a repaint for the corresponding `token` variable that was returned with it. 

Call 1: [tokenA, setTokenA] = useToken()
Call 2: [tokenB, setTokenB] = useToken()

calling the first setToken will repaint everywhere tokenA is used, but not tokenB.
*/

const Login = (
  setToken: (userToken?: { token: string }) => void
): JSX.Element => {
  const state: { [key: string]: string } = { username: "", password: "" };

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    state[e.currentTarget.name] = e.currentTarget.value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await loginUser(state);
    setToken(token);
  };

  return (
    <Block center size="xs-6">
      <Form id="loginForm" onSubmit={handleSubmit}>
        <img src="/images/fulllogo.png" width="300px" alt="Logo" />
        <Form.Input
          label="Username"
          type="text"
          required
          name="username"
          onChange={handleChange}
        />
        <Form.Input
          label="Password"
          type="password"
          required
          name="password"
          onChange={handleChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
    </Block>
  );
};

export default Login;
