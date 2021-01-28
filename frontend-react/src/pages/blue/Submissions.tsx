import React, { useEffect, useState } from "react";
import { Block, Countdown } from "../../components";
import { SubmissionType } from "../../types";

import Moment from "react-moment";

import "../../components/Icons.scss";
import { Table } from "semantic-ui-react";

const Submissions = (): JSX.Element => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/submissions")
      .then((res) => res.json())
      .then((subs) => setSubmissions(subs));
  }, []);

  return (
    <>
      <Countdown />
      <Block transparent size="xs-12">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Submission ID</Table.HeaderCell>
              <Table.HeaderCell>Problem</Table.HeaderCell>
              <Table.HeaderCell>Submission #</Table.HeaderCell>
              <Table.HeaderCell>Language</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.length == 0 ? (
              <Table.Row>
                <Table.Cell colspan="7" style={{ textAlign: "center" }}>
                  No Submissions
                </Table.Cell>
              </Table.Row>
            ) : (
              submissions.map((submission: SubmissionType, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <a href={`/blue/submissions/${submission.submission_id}`}>
                      {submission.submission_id.substring(0, 7)}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    <a href={`/blue/problems/${submission.problem_id}`}>
                      {submission.prob_name}
                    </a>
                  </Table.Cell>
                  <Table.Cell> {submission.sub_no + 1} </Table.Cell>
                  <Table.Cell> {submission.language} </Table.Cell>
                  <Table.Cell
                    className={`icn ${submission.status}`}
                  ></Table.Cell>
                  <Table.Cell>
                    <Moment fromNow>{submission.date * 1000}</Moment>
                  </Table.Cell>
                  <Table.Cell> {submission.score} </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  );
};

export default Submissions;
