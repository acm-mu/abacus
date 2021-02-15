import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Table, Label } from "semantic-ui-react"
import { Block } from "../../components"
import { SubmissionType } from "../../types"

const Submission = (): JSX.Element => {
  const [submission] = useState<SubmissionType>()
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
              <Table.Cell rowspan={2}><Link
                to={`/gold/submissions/${submission?.submission_id}`}>{submission?.submission_id.substring(0, 7)}</Link>
              </Table.Cell>
              <Table.Cell fromnow="{{ submission.date*1000 }}"></Table.Cell>
              <Table.Cell><Link to={`/gold/problems/${submission?.problem_id}`}>{submission?.problem.problem_name}</Link></Table.Cell>
              <Table.Cell className={`icn ${submission?.status}`}></Table.Cell>
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