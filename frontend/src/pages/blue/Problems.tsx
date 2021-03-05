import React, { useState, useEffect, useContext } from "react";
import { Icon, Label, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown } from "../../components";
import '../../components/Table.scss'
import config from '../../environment'
import { Problem, Submission } from "abacus";
import AppContext from "../../AppContext";

const Problems = (): JSX.Element => {
  const { user } = useContext(AppContext);
  const [isMounted, setMounted] = useState<boolean>(false)
  const [problems, setProblems] = useState<Problem[]>();
  const [submissions, setSubmissions] = useState<{ [key: string]: Submission[] }>()

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/problems?division=blue`)
      .then((res) => res.json())
      .then((probs) => {
        if (isMounted) {
          probs = Object.values(probs)
          probs.sort((a: Problem, b: Problem) => a.id.localeCompare(b.id))
          setProblems(probs)
        }
      })

    fetch(`${config.API_URL}/submissions?division=blue&tid=${user?.uid}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const submissions: Submission[] = Object.values(data)
          const subs: { [key: string]: Submission[] } = {}
          submissions.forEach((sub: Submission) => {
            const { pid } = sub
            if (!(pid in subs)) subs[pid] = []
            subs[pid].push(sub)
          })
          setSubmissions(subs)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted]);

  const problemInfo = (problem: Problem) => {
    if (submissions && problem.pid in submissions && submissions[problem.pid].length) {
      const subs = submissions[problem.pid].sort((s1, s2) => s1.date - s2.date)
      const lastSub = subs[subs.length - 1]
      return (
        <>
          <Table.Cell>{subs.length}</Table.Cell>
          <Table.Cell>
            <Link to={`/blue/submissions/${lastSub.sid}`}>{lastSub.sid.substring(0, 7)}</Link>
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
            {problems ? problems.map((problem: Problem) =>
              <Table.Row key={problem.pid}>
                <Table.HeaderCell collapsing textAlign='center'>{problem.id}</Table.HeaderCell>
                <Table.Cell>
                  <Link to={`/blue/problems/${problem.id}`}>{problem.name}</Link>
                </Table.Cell>
                {problemInfo(problem)}
              </Table.Row>
            ) : <></>}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Problems;
