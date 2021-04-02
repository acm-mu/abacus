import { Block } from "components"
import React, { useContext } from "react"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Loader, Table } from "semantic-ui-react"
import { userHome } from "utils"
import { AppContext } from "context"
import SubmissionContext from "./SubmissionContext"

const SubmissionDetail = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const { rerunning, submission } = useContext(SubmissionContext)

  if (!user || !submission) return <></>

  const user_home = userHome(user)

  const showUser = submission.tid != user.uid

  const submission_link = <Table.Cell rowSpan={2}><Link to={`${user_home}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link></Table.Cell>
  const submission_team = <Table.Cell>{submission.team.display_name}</Table.Cell>
  const submission_date = <Table.Cell><Moment fromNow date={submission.date * 1000} /></Table.Cell>
  const submission_problem = <Table.Cell><Link to={`${user_home}/problems/${submission.problem.id}`}>{submission.problem.name}</Link></Table.Cell>

  if (submission.division == 'blue') {
    return <Block transparent size='xs-12'>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
            {showUser && <Table.HeaderCell>TEAM</Table.HeaderCell>}
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>PROBLEM</Table.HeaderCell>
            <Table.HeaderCell>STATUS</Table.HeaderCell>
            <Table.HeaderCell>CPU</Table.HeaderCell>
            <Table.HeaderCell>SCORE</Table.HeaderCell>
            <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell colSpan={7}>TEST CASES</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {submission_link}
            {showUser && submission_team}
            {submission_date}
            {submission_problem}
            <Table.Cell>
              {rerunning ? <Loader inline size='small' active /> : <span className={`icn status ${submission.status}`} />}
            </Table.Cell>
            <Table.Cell>{rerunning ? <Loader active inline size='small' /> : Math.floor(submission.runtime || 0)}</Table.Cell>
            <Table.Cell>{rerunning ? <Loader active inline size='small' /> : submission.score}</Table.Cell>
            <Table.Cell>{submission.language}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colSpan={7}>
              {rerunning ? <Loader inline size='small' active /> :
                submission.tests?.map(({ result }, index) => <span key={`test-${index}`} className={`result icn ${result}`} />)
              }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Block>
  } else if (submission.division == 'gold') {
    return <Block size='xs-12'>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
            {showUser && <Table.HeaderCell>TEAM</Table.HeaderCell>}
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>PROBLEM</Table.HeaderCell>
            <Table.HeaderCell>STATUS</Table.HeaderCell>
            <Table.HeaderCell>SCORE</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {submission_link}
            {showUser && submission_team}
            {submission_date}
            {submission_problem}
            <Table.Cell><span className={`icn status ${submission.status}`} /></Table.Cell>
            <Table.Cell>{submission.score}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Block>
  }

  return <></>
}

export default SubmissionDetail