import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import {Block, Countdown } from '../../components'

const Submission = (): JSX.Element => (
  <>
  <Countdown />
  <Block size="xs-12">
    <h1>Submission</h1>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowspan="2">ID</Table.HeaderCell>
          <Table.HeaderCell>DATE</Table.HeaderCell>
          <Table.HeaderCell>PROBLEM</Table.HeaderCell>
          <Table.HeaderCell>STATUS</Table.HeaderCell>
          <Table.HeaderCell>CPU</Table.HeaderCell>
          <Table.HeaderCell>LANG</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell colspan="5">TEST CASES</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowspan="2"><Link to="/blue/submissions/{{ submission.submission_id }}">submission.submission_id|string)[:7]</Link>
          </Table.Cell>
          <Table.Cell fromnow="{{ submission.date*1000 }}"></Table.Cell>
          <Table.Cell><Link to="/blue/problems/{{ submission.prob_id }}"> submission.prob_name </Link></Table.Cell>
          <Table.Cell class="icn {{ submission.status }}"></Table.Cell>
          <Table.Cell> (submission.runtime|string)[:4] </Table.Cell>
          <Table.Cell> submission.language </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colspan="5">
             for test in submission.tests 
               if test.result == accepted
              <span className="result icn accepted"></span>
              elif test.result == rejected
              <span className="result icn rejected"></span>
              else 
              <span className="result"></span>
               endif 
             endfor 
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Block>

  <Block size="xs-12">
    <p>Submission contains 1 file:</p>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>FILENAME</Table.HeaderCell>
          <Table.HeaderCell>FILESIZE</Table.HeaderCell>
          <Table.HeaderCell>SHA-1 SUM</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell> submission.filename </Table.Cell>
          <Table.Cell> submission.filesize  bytes</Table.Cell>
          <Table.Cell> submission.sha1sum </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>

    <h3> submission.filename </h3>
    <pre>
      <code className="{{ submission.language }}"> contents </code>
    </pre>
  </Block>
  
  </>
)

export default Submission