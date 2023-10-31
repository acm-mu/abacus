import type { ITestResult } from "abacus"
import { Block } from 'components'
import { AppContext } from 'context'
import React, { useContext } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownProps, Loader, Table } from 'semantic-ui-react'
import { statuses, userHome } from 'utils'
import BlueSubmissionContext from "./context"

const BlueSubmissionDetail = (): React.JSX.Element => {
  const { user, settings } = useContext(AppContext)
  const { rerunning, submission, setSubmission } = useContext(BlueSubmissionContext)

  if (!user || !submission) return <></>

  const handleDropdownChange = (_event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
    if (setSubmission) {
      if (value && settings) {
        setSubmission({ ...submission, status: `${value}`, score: 0 })
      }
    }
  }

  const user_home = userHome(user)

  const showUser = submission.tid != user.uid
  
  return <Block transparent size="xs-12">
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
          {showUser && <Table.HeaderCell>TEAM</Table.HeaderCell>}
          <Table.HeaderCell>DATE</Table.HeaderCell>
          <Table.HeaderCell>PROBLEM</Table.HeaderCell>
          <Table.HeaderCell>SUB NO</Table.HeaderCell>
          <Table.HeaderCell>STATUS</Table.HeaderCell>
          <Table.HeaderCell>SCORE</Table.HeaderCell>
          <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell colSpan={8}>TEST CASES</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowSpan={2}>
            <Link to={`${user_home}/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
          </Table.Cell>
          {showUser && <Table.Cell>{submission.team?.display_name}</Table.Cell>}
          <Table.Cell>
            <Moment fromNow date={submission.date * 1000} />
          </Table.Cell>
          <Table.Cell>
            <Link
              to={`${user_home}/problems/${
                user.role == 'admin' || user.role == 'judge' || user.role == 'proctor'
                  ? submission.problem.pid
                  : submission.problem.id
              }`}>
              {submission.problem.name}
            </Link>
          </Table.Cell>
          <Table.Cell>{submission.sub_no + 1}</Table.Cell>
          <Table.Cell>
            {rerunning ? (
              <Loader inline size="small" active />
            ) : setSubmission ? (
              <Dropdown
                value={submission.status}
                className={`icn ${submission.status}`}
                onChange={handleDropdownChange}
                options={statuses}
              />
            ) : (
              <span className={`icn status ${submission.status}`} />
            )}
          </Table.Cell>
          <Table.Cell>{rerunning ? <Loader active inline size="small" /> : submission.score}</Table.Cell>
          <Table.Cell>{submission.language}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan={8}>
            {rerunning ? (
              <Loader inline size="small" active />
            ) : (
              submission.tests?.map((test) => {
                if ('result' in test) {
                  return <span key={`test-${test}`} className={`result icn ${(test as ITestResult).result}`} />
                } else {
                  return <span key={`test-${test}`} className={`result icn`} />
                }
              })
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Block>
}

export default BlueSubmissionDetail
