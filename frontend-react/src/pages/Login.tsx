import React from "react";
import { Button, Form } from "semantic-ui-react";
import { Block } from "../components";

const Login = (): JSX.Element => (
  <Block center size='xs-6'>
    <Form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src="/images/fulllogo.png" width="300px" alt="Logo" />
      <Form.Input label="Username" type="text" required />
      <Form.Input label="Password" type="password" required />
      <Button type="submit" primary>
        Login
      </Button>
    </Form>
  </Block>
);

// <div class="center block xs-6">
// {% if is_logged_in() %}
// <h3>You are already logged in!</h3>
// {% else %}
// <form action="/login" method="POST" class="ui form">
//   <img src="{{ url_for('static', filename='images/fulllogo.png') }}" width="300px">
//   <div class="field">
//     <label>Username</label>
//     <input type="text" name="user-name" required>
//   </div>
//   <div class="field">
//     <label>Password</label>
//     <input type="password" name="password" required>
//   </div>
//   <input type="submit" class="ui blue button" value="Login">
// </form>
// {% endif %}

// .ui.form {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// }

export default Login;
