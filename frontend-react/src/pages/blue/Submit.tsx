import React from 'react'

import { Block, Countdown } from '../../components'
import { Form, Button, Select } from 'semantic-ui-react'

const languages = [
  { key: 'python3', value:'Python 3', text: 'Python 3'},
  { key: 'java', value:'Java', text: 'Java'},
  { key: 'c', value:'C', text: 'C'}
]

const Submit = (): JSX.Element => (
  <>
  <Countdown />
  <Block size='xs-12'>
    <h1>Submit a solution to - </h1>

    <Form action="/api/submissions" method="POST" enctype="multipart/form-data" callback="submissionSuccess" async>
      <input type="hidden" name="problem-id" value="{{ problem_id }}"/>
      <div id="file_dialog">
        <div className="message">
          <b>Drag & drop</b>&nbsp; a file here to upload<br />
          <i>(Or click and choose file)</i>
        </div>
        <input id="sub_files_input" type="file" name="sub-file" />
      </div>

      <Form.Group widths='equal'>
        <Form.Field id={'languages'} label='Language'>
          <Select options={languages} />
        </Form.Field>
      </Form.Group>

      {/* <div class="ui button">Cancel</div> */}
      <Button>Cancel</Button>
      <Form.Button>Submit</Form.Button>
      {/* <input class="ui button" type="submit" value="Submit"> */}
    </Form>
  </Block>
  </>
)
export default Submit