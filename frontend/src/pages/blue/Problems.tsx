import React, { useState, useEffect } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown } from "../../components";
import { ProblemType } from '../../types'
import '../../components/Table.scss'
import config from '../../environment'


const Problems = (): JSX.Element => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch(`${config.API_URL}/v1/problems?division=blue`)
      .then((res) => res.json())
      .then((probs) => setProblems(Object.values(probs)));
  }, []);

  return (
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
            {problems.map((problem: ProblemType, index) =>
              <Table.Row key={index}>
                <Table.HeaderCell collapsing>{problem.id}</Table.HeaderCell>
                <Table.Cell>
                  <Link to={`/blue/problems/${problem.id}`}>{problem.problem_name}</Link>
                </Table.Cell>
                <Table.Cell>{problem?.tests?.length}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Problems;
