import React, { useState } from "react"
import { Table, Label } from "semantic-ui-react"
import { Block } from "../../components"

const Submission = (): JSX.Element => {
  const [submission] = useState({
    submission_id: '',
    prob_name: '',
    prob_id: '',
    status: ''
  })
  return (
    <>
      <Block size='xs-12'>
        <h1>Submission</h1>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowspan={2}>ID</Table.HeaderCell>
              <Table.HeaderCell>DATE</Table.HeaderCell>
              <Table.HeaderCell>PROBLEM</Table.HeaderCell>
              <Table.HeaderCell>STATUS</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell rowspan={2}><a
                href={`/gold/submissions/${submission.submission_id}`}>{submission.submission_id.substring(0, 7)}</a>
              </Table.Cell>
              <Table.Cell fromnow="{{ submission.date*1000 }}"></Table.Cell>
              <Table.Cell><a href={`/gold/problems/${ submission.prob_id }`}>{ submission.prob_name }</a></Table.Cell>
              <Table.Cell className={`icn ${submission.status}`}></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Block>

      <Block size='xs-12'>
        <h3>Scratch Live Preview</h3>
        <Label target='_blank' href='{{ submission.filename }}' icon='linkify'> Link to Project</Label>
        <br /><br />
        {/* <iframe id='scratch_embedded' src="{{ submission.filename }}/embed" allowtransparency="true" width="603" height="500"
          frameborder="0" scrolling="no" allowfullscreen></iframe> */}
      </Block>
    </>)
}

export default Submission