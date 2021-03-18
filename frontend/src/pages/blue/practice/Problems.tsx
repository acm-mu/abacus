import React from 'react';
import { Block, Countdown } from "components"
import { Breadcrumb, Button, Label, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Problem } from '.';
import { Submission } from 'abacus';

interface PracticeProblemsProps {
  problems: { [key: string]: Problem };
  submissions: { [key: string]: Submission }
}

const PracticeProblems = ({ problems, submissions }: PracticeProblemsProps): JSX.Element => <>
  <Countdown />
  <Block transparent size='xs-12'>
    <Breadcrumb>
      <Breadcrumb.Section active>Practice</Breadcrumb.Section>
    </Breadcrumb>
  </Block>

  <Block size="xs-12">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h1>Practice Problems</h1>
      {Object.values(submissions).length > 0 ? <div><Button onClick={() => { localStorage.removeItem('submissions'); location.reload() }} content="Clear History" /></div> : <></>}
    </div>
    <p>Here you can practice problems from previous year&lsquo;s competitions.</p>


    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing></Table.HeaderCell>
          <Table.HeaderCell>Problem Name</Table.HeaderCell>
          <Table.HeaderCell>Year</Table.HeaderCell>
          <Table.HeaderCell>Submissions</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(problems).map(([id, { name, year }]) => {
          const subs = Object.values(submissions).filter(sub => sub.pid == id)
          return <Table.Row key={id}>
            <Table.HeaderCell>{id}</Table.HeaderCell>
            <Table.Cell>
              <Link to={`/blue/practice/${id}`}>{name}</Link>
            </Table.Cell>
            <Table.Cell>{year}</Table.Cell>
            <Table.Cell>{subs.length}</Table.Cell>
            <Table.Cell>{subs.length > 0 ? (() => {
              switch (subs[subs.length - 1].status) {
                case 'accepted': return <Label icon='check' color='green' content="Accepted" />
                case 'rejected': return <Label icon='times' color='red' content="Failed" />
                case 'pending': return <Label icon='question' content="Pending" />
                default: return <Label content={subs[subs.length - 1].status} />
              }
            })() : <Label content="Unattempted" />}</Table.Cell>
          </Table.Row>
        })}
      </Table.Body>
    </Table>
  </Block>
</>

export default PracticeProblems