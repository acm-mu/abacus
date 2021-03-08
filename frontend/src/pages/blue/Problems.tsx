import React, { useEffect, useState } from "react";
import { Loader, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown } from "../../components";
import '../../components/Table.scss'
import config from '../../environment'
import { Problem } from "abacus";

const Problems = (): JSX.Element => {
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>()

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  const loadProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?type=list&division=blue`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    let problems = Object.values(await response.json()) as Problem[]

    problems = problems.sort((p1: Problem, p2: Problem) => p1.id.localeCompare(p2.id))
    setProblems(problems)
    setLoading(false)
  }

  if (isLoading) return <Loader active inline='centered' content="Loading" />

  return (
    <>
      <Countdown />
      <Block size="xs-12" transparent>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Problem Name</Table.HeaderCell>
              {/* <Table.HeaderCell># of Submissions</Table.HeaderCell>
              <Table.HeaderCell>Latest Submission</Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {problems ? problems.map((problem: Problem) =>
              <Table.Row key={problem.pid}>
                <Table.HeaderCell collapsing textAlign='center'>{problem.id}</Table.HeaderCell>
                <Table.Cell>
                  <Link to={`/blue/problems/${problem.id}`}>{problem.name}</Link>
                </Table.Cell>
                {/* <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell> */}
              </Table.Row>
            ) : <></>}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Problems;
