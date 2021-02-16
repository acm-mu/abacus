import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownView from "react-showdown";
import { Button, Popup } from "semantic-ui-react";
import { Block, Countdown } from '../../components'
import { ProblemType, SubmissionType } from '../../types'
import config from '../../environment'
import "./Problem.scss";
import { UserContext } from "../../context/user";

const Problem = (): JSX.Element => {
  const [problem, setProblem] = useState<ProblemType>();
  const [submissions, setSubmissions] = useState<SubmissionType[]>()
  const { user } = useContext(UserContext)
  const { problem_id } = useParams<{ problem_id: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=blue&id=${problem_id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          const problem = Object.values(res)[0] as ProblemType
          setProblem(problem);
          if (user)
            fetch(`${config.API_URL}/submissions?team_id=${user?.user_id}&problem_id=${problem.problem_id}`)
              .then((res => res.json()))
              .then(res => setSubmissions(Object.values(res)))
        }
      });
  }, []);


  return (
    <>
      <Countdown />
      <Block size='xs-9' className='problem'>
        <h1>
          Problem {problem?.id}
          <br />
          {problem?.problem_name}
        </h1>
        <hr />
        <div className="markdown">
          <MarkdownView markdown={problem?.description || ""} />
        </div>
      </Block>
      <Block size='xs-3'>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {!submissions || submissions?.filter((e) => e.status == "accepted").length == 0 ?
            <Popup
              trigger={
                <Button
                  as={Link}
                  to={`/blue/problems/${problem?.id}/submit`}
                  content="Submit"
                  icon="upload"
                />
              }
              content="Submit"
              position="top center"
              inverted /> : <></>
          }
          {/* <Popup
            trigger={<Button content="Stats" icon="chart bar" />}
            content="Stats"
            position="top center"
            inverted
          /> */}
        </div>
        <p><b>Problem ID:</b> {problem?.id}</p>
        <p><b>CPU Time limit:</b> {problem?.cpu_time_limit}</p>
        <p><b>Memory limit:</b> {problem?.memory_limit}</p>
        <p><b>Download:</b> <Link to='#'>Sample data files</Link></p>
      </Block>
    </>
  );
}

export default Problem;
