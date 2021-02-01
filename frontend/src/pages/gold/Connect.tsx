import React from "react"
import { Input, Form, Button } from "semantic-ui-react"
import { Block } from "../../components"

const Connect= (): JSX.Element => (
<Block size='xs-12'>
  <p>You have not yet attached your Scratch® account to your profile. Please enter it below.</p>
  <Form action="/gold/connect" method="POST" class="ui action input">
    <Input placeholder="Scratch Username" />
    <Button content='Connect' floated='right' type="submit" disabled />
  </Form>
</Block>
)

export default Connect