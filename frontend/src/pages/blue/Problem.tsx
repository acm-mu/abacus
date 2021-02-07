import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownView from "react-showdown";
import { Button, Popup } from "semantic-ui-react";
import { Block, Countdown } from '../../components'
import { ProblemType } from '../../types'
import config from '../../environment'
import "./Problem.scss";

const Problem: React.FunctionComponent = () => {
  const [problem, setProblem] = useState<ProblemType>();
  const { problem_id } = useParams<{ problem_id: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=blue&id=${problem_id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res) setProblem(Object.values(res)[0] as ProblemType);
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
          <Popup
            trigger={
              <Button
                as={Link}
                to={`/blue/problems/${problem?.id}/submit`}
                content="Submit"
                icon="upload" />
            }
            content="Submit"
            position="top center"
            inverted />
          {/* <Popup
            trigger={<Button content="Stats" icon="chart bar" />}
            content="Stats"
            position="top center"
            inverted
          /> */}
        </div>
        <p>
          <b>Problem ID:</b> {problem?.id}
        </p>
        <p>
          <b>CPU Time limit:</b> {problem?.cpu_time_limit}
        </p>
        <p>
          <b>Memory limit:</b> {problem?.memory_limit}
        </p>
        <p>
          <b>Download:</b> <Link to='#'>Sample data files</Link>
        </p>
      </Block>
    </>
  );
}

export default Problem;
