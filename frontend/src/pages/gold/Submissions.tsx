import { Submission } from 'abacus'
import React, { useContext, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Block, Unauthorized } from 'components'
import AppContext from 'AppContext'
import { Helmet } from 'react-helmet'

const Submissions = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const [submissions] = useState<Submission[]>()

  if (!user) return <Unauthorized />

  return <>
    <Helmet> <title>Abacus | Gold Submissions</title> </Helmet>
    <Block size='xs-12' transparent>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Submission ID</Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Submission #</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions ?
            (submissions.map((submission: Submission, index: number) => (
              <Table.Row key={index}>
                <Table.Cell><Link to={`/gold/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link></Table.Cell>
                <Table.Cell><Link to={`/gold/problems/${submission.pid}`}>{submission.problem?.name} </Link></Table.Cell>
                <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                <Table.Cell className={`icn ${submission.status}`}></Table.Cell>
                <Table.Cell><Moment fromNow date={submission.date * 1000} /></Table.Cell>
                <Table.Cell>{submission.score}</Table.Cell>
              </Table.Row>
            ))) : (
              <Table.Row>
                <Table.Cell colSpan={'100%'} style={{ textAlign: 'center' }}>No Submissions</Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table>
    </Block>
  </>
}

export default Submissions