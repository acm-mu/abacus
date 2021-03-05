import React, { useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { Loader, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown, Unauthorized } from "../../components";
import config from '../../environment'
import "../../components/Icons.scss";
import AppContext from "../../AppContext";
import { Submission } from "abacus";

const Submissions = (): JSX.Element => {
  const { user } = useContext(AppContext);
  const [isMounted, setMounted] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [submissions, setSubmissions] = useState<Submission[]>();

  useEffect(() => {
    setMounted(true)
    if (user) {
      const filter = (user && !['judge', 'admin'].includes(user.role)) ? `&tid=${user.uid}` : ''

      fetch(`${config.API_URL}/submissions?division=blue${filter}`)
        .then(res => res.json())
        .then((subs) => {
          setLoading(false)
          setSubmissions(Object.values(subs))
        });
    }
    return () => { setMounted(false) }
  }, [user, isMounted]);

  return (
    <>
      {user ?
        <>
          <Countdown />
          <Block transparent size="xs-12">
            {isLoading ?
              <Loader active inline='centered' content="Loading" /> :
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
                  {submissions?.length ? (submissions.sort((s1, s2) => s2.date - s1.date).map((submission: Submission, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Link to={`/blue/submissions/${submission.sid}`}>
                          {submission.sid.substring(0, 7)}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/blue/problems/${submission.problem.id}`}>
                          {submission.problem.name}
                        </Link>
                      </Table.Cell>
                      <Table.Cell> {submission.sub_no + 1} </Table.Cell>
                      <Table.Cell> {submission.language} </Table.Cell>
                      <Table.Cell>
                        <span className={`status icn ${submission.status}`} />
                      </Table.Cell>
                      <Table.Cell>
                        <Moment fromNow>{submission.date * 1000}</Moment>
                      </Table.Cell>
                      <Table.Cell> {submission.score} </Table.Cell>
                    </Table.Row>
                  ))) :
                    (<Table.Row>
                      <Table.Cell colSpan={7} style={{ textAlign: "center" }}>
                        You don&lsquo;t have any submissions yet. Go write some code!
                    </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
              </Table>}
          </Block>
        </> :
        <Unauthorized />}
    </>
  );
};

export default Submissions;
