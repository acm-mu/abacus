import React, { useState, useEffect, useContext } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown, Unauthorized } from "../../components";
import { ProblemType } from '../../types'
import '../../components/Table.scss'
import config from '../../environment'
import { UserContext } from "../../context/user";
import { useAuth } from "../../authlib";

const Problems = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [isAuthenticated] = useAuth(user, isMounted)
  const [problems, setProblems] = useState<ProblemType[]>();

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
    return () => { setMounted(false) }
  }, [isMounted]);

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
                  <Table.HeaderCell># of Tests</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {problems ? problems.map((problem: ProblemType, index: number) =>
                  <Table.Row key={index}>
                    <Table.HeaderCell collapsing>{problem.id}</Table.HeaderCell>
                    <Table.Cell>
                      <Link to={`/blue/problems/${problem.id}`}>{problem.problem_name}</Link>
                    </Table.Cell>
                    <Table.Cell>{problem?.tests?.length}</Table.Cell>
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
