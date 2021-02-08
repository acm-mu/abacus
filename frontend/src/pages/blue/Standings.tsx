import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Table } from "semantic-ui-react";
import { Block, Countdown } from "../../components";
import { ProblemScoreType, ProblemType, StandingsUser } from "../../types";
import config from '../../environment'

import "./Standings.scss";

const Standings = (): JSX.Element => {
  const [problems, setProblems] = useState([]);
  const [standings, setStandings] = useState([]);

  let isMounted = false
  useEffect(() => {
    isMounted = true
    fetch(`${config.API_URL}/problems?division=blue`)
      .then((res) => res.json())
      .then((problems) => {
        problems = Object.values(problems)
        problems.sort((a: ProblemType, b: ProblemType) => a.id.localeCompare(b.id))
        if (isMounted)
          setProblems(problems)
      });

    fetch(`${config.API_URL}/standings`)
      .then((res) => res.json())
      .then((standings) => {
        standings = Object.values(standings)
        standings.sort((a: StandingsUser, b: StandingsUser) => b.solved - a.solved)
        if (isMounted)
          setStandings(standings)
      });
    return () => { isMounted = false }
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
              {problems.map((problem: ProblemType, index: number) => (
                <Table.HeaderCell key={index} collapsing>
                  <Link to={`/blue/problems/${problem.id}`}>{problem.id}</Link>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {standings.map((team: StandingsUser, index: number) => (
              <Table.Row key={index}>
                <Table.Cell collapsing>{index + 1}</Table.Cell>
                <Table.Cell>
                  <Link to="#">{team.display_name}</Link>
                </Table.Cell>
                <Table.Cell>{team.solved}</Table.Cell>
                <Table.Cell>{team.time}</Table.Cell>
                {Object.values(team.problems).map(
                  (problem: ProblemScoreType, index: number) => {
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
