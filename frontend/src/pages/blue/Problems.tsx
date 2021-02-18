import React, { useState, useEffect, useContext } from "react";
import { Icon, Label, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown, Unauthorized } from "../../components";
import { ProblemType, SubmissionType } from '../../types'
import '../../components/Table.scss'
import config from '../../environment'
import { UserContext } from "../../context/user";
import { useAuth } from "../../authlib";

const Problems = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [isAuthenticated] = useAuth(user, isMounted)
  const [problems, setProblems] = useState<ProblemType[]>();
  const [submissions, setSubmissions] = useState<{ [key: string]: SubmissionType[] }>()

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/problems?division=blue`)
      .then((res) => res.json())
      .then((probs) => {
        if (isMounted) {
          probs = Object.values(probs)
          probs.sort((a: ProblemType, b: ProblemType) => a.id.localeCompare(b.id))
          setProblems(probs)
        }
      })

    fetch(`${config.API_URL}/submissions?division=blue&team_id=${user?.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const submissions: SubmissionType[] = Object.values(data)
          const subs: { [key: string]: SubmissionType[] } = {}
          submissions.forEach((sub: SubmissionType) => {
            const { problem_id } = sub
            if (!(problem_id in subs)) subs[problem_id] = []
            subs[problem_id].push(sub)
          })
          setSubmissions(subs)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted]);

  const problemInfo = (problem: ProblemType) => {
    if (submissions && problem.problem_id in submissions && submissions[problem.problem_id].length) {
      const subs = submissions[problem.problem_id].sort((s1, s2) => s1.date - s2.date)
      const lastSub = subs[subs.length - 1]
      return (
        <>
          <Table.Cell>{subs.length}</Table.Cell>
          <Table.Cell>
            <Link to={`/blue/submissions/${lastSub.submission_id}`}>{lastSub.submission_id.substring(0, 7)}</Link>
            {(() => {
              switch (lastSub.status) {
                case 'accepted':
                  return <Label color='green' style={{ float: 'right' }}><Icon name='check' /> Accepted</Label>
                case 'rejected':
                  return <Label color='red' style={{ float: 'right' }}><Icon name='times' /> Rejected</Label>
                default:
                  return <Label style={{ float: 'right' }}><Icon name='question' />Pending</Label>
              }
            })()}
          </Table.Cell>
        </>
      )
    }
    return (<> <Table.Cell /><Table.Cell /></>)

  }

  return (
    <>
      {isAuthenticated ?
        <>
          <Countdown />
          <Block size="xs-12" transparent>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>Problem Name</Table.HeaderCell>
                  <Table.HeaderCell># of Submissions</Table.HeaderCell>
                  <Table.HeaderCell>Latest Submission</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {problems ? problems.map((problem: ProblemType, index: number) =>
                  <Table.Row key={index}>
                    <Table.HeaderCell collapsing textAlign='center'>{problem.id}</Table.HeaderCell>
                    <Table.Cell>
                      <Link to={`/blue/problems/${problem.id}`}>{problem.problem_name}</Link>
                    </Table.Cell>
                    {problemInfo(problem)}
                  </Table.Row>
                ) : <></>}
              </Table.Body>
            </Table>
          </Block>
        </> :
        <Unauthorized />
      }
    </>
  );
};

export default Problems;
