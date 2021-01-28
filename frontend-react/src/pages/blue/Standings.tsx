import React, { useEffect, useState } from "react";
import { Block, Countdown } from "../../components";
import { Table } from "semantic-ui-react";
import { ProblemType } from "../../types";

import "./Standings.scss";

const Standings = (): JSX.Element => {
  const [problems, setProblems] = useState([]);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/problems?division=blue")
      .then((res) => res.json())
      .then((problems) => setProblems(problems));

    fetch("http://localhost:5000/api/standings")
      .then((res) => res.json())
      .then((standings) => setStandings(standings));
  }, []);

  return (
    <>
      <Countdown />
      <Block size="xs-12" transparent>
        <div className="table-legend">
          <div>
            <span className="legend-solved legend-status"></span>
            <p className="legend-label">Full score</p>
          </div>
          <div>
            <span className="legend-attempted legend-status"></span>
            <p className="legend-label">Attempted problem</p>
          </div>
          <div>
            <span className="legend-pending legend-status"></span>
            <p className="legend-label">Pending judgement</p>
          </div>
        </div>

        <Table celled id={"standings"}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>RK</Table.HeaderCell>
              <Table.HeaderCell>Team</Table.HeaderCell>
              <Table.HeaderCell collapsing>SLV.</Table.HeaderCell>
              <Table.HeaderCell collapsing>TIME</Table.HeaderCell>
              {problems.map((problem: ProblemType, index) => (
                <Table.HeaderCell key={index} collapsing>
                  <a href={`/blue/problems/${problem.id}`}>{problem.id}</a>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {standings.map((team: any, index) => (
              <Table.Row key={index}>
                <Table.Cell collapsing>{index + 1}</Table.Cell>
                <Table.Cell>
                  <a href="">{team.display_name}</a>
                </Table.Cell>
                <Table.Cell>{team.solved}</Table.Cell>
                <Table.Cell>{team.time}</Table.Cell>
                {Object.values(team.problems).map(
                  (problem: any, index: any) => {
                    if (problem.solved) {
                      return (
                        <Table.Cell key={index} className="solved">
                          {problem.problem_score}
                          <br />
                          {problem.submissions.length}
                        </Table.Cell>
                      );
                    } else if (problem.submissions.length > 0) {
                      return (
                        <Table.Cell key={index} className="attempted">
                          --
                          <br />
                          {problem.submissions.length}
                        </Table.Cell>
                      );
                    } else {
                      return <Table.Cell key={index}></Table.Cell>;
                    }
                    // <Table.Cell key={index} className="team_problem_solve"></Table.Cell>
                  }
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Standings;
