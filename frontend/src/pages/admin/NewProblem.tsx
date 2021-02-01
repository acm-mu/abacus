import React from 'react'

import { Form, Input, Button, Menu, TextArea, Segment, Grid } from "semantic-ui-react"

const NewProblem = (): JSX.Element => {
  return (
    <Form> {/* /api/problems POST*/}
      <Button color='blue' style={{ float: 'right' }}>Create</Button>
      <h1>New Problem</h1>
      <Form.Field label='Problem ID' control={Input} />
      <Form.Field label='Problem Name' control={Input} />

      <Form.Group widths='equal'>
        <Form.Field label='Memory Limit' control={Input} />
        <Form.Field label='CPU Time Limit' control={Input} />
      </Form.Group>

      <label>Tests</label>
      <Menu attached='top' tabular>
        <Menu.Item>
          <Button icon='plus' color='blue' />
        </Menu.Item>
      </Menu>
      <Segment>
        <Grid columns={2} stackable>
          <Grid.Column>
            <Form.Field label='Input' control={TextArea} />
          </Grid.Column>
          <Grid.Column>
            <Form.Field label='Output' control={TextArea} />
          </Grid.Column>
        </Grid>
      </Segment>

      <Form.Group widths='equal'>
        <Segment>
          <Grid columns={2} stackable>
            <Grid.Column>
              <Form.Field label='Problem Description' control={TextArea} />
            </Grid.Column>
            <Grid.Column>
              <Form.Field label='Preview' control={TextArea} />
            </Grid.Column>
          </Grid>
        </Segment>
      </Form.Group>
    </Form>

    // <form class="ui form" action="/api/problems" method="POST" onsuccess="success" async>
    //   <input type="submit" value="Create" class="ui primary button" style="float: right">

    //   <div class="field">
    //     <label>Tests</label>
    //     <div class="ui top attached tabular menu" id="tests">
    //       <div class="item" onclick="newTest(this)">+</div>
    //     </div>
    //     <div class="ui bottom attached active tab segment" id="tests_content">
    //       <div class="field">
    //         <div class="ui button negative" onclick="deleteActive(this)">Delete</div>
    //     </div>
    //   </div>
  )
}

export default NewProblem