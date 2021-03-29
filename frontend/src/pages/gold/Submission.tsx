import { Submission } from "abacus"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "semantic-ui-react"
import { Block, ScratchViewer } from "components"
import { Helmet } from "react-helmet"

const submission = (): JSX.Element => {
  const [submission] = useState<Submission>()
  return <>
    <Helmet> <title>Abacus | Gold Submission</title> </Helmet>
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
              to={`/gold/submissions/${submission?.sid}`}>{submission?.sid.substring(0, 7)}</Link>
            </Table.Cell>
            <Table.Cell fromnow="{{ submission.date*1000 }}"></Table.Cell>
            <Table.Cell><Link to={`/gold/problems/${submission?.pid}`}>{submission?.problem?.name}</Link></Table.Cell>
            <Table.Cell className={`icn ${submission?.status}`}></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Block>
    {submission?.filename ?
      <Block size='xs-12'>
        <ScratchViewer project_id={submission?.filename} />
      </Block> : <></>}
  </>
}

export default submission