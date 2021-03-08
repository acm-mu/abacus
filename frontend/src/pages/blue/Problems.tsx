import React from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown } from "../../components";
import '../../components/Table.scss'
import config from '../../environment'
import { Problem } from "abacus";
import { useFetch } from "../../utils";

const Problems = (): JSX.Element => {
  const { data: problems } = useFetch<Problem[]>(`${config.API_URL}/problems?type=list&division=blue`)

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
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ) : <></>}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Problems;
