import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MarkdownView from "react-showdown";
import { Button, Popup } from "semantic-ui-react";
import { Block, Countdown } from '../../components'
import "./Problem.scss";
import { ProblemType } from '../../types'

const Problem: React.FunctionComponent = () => {
  const [problem, setProblem] = useState<ProblemType>();

  useEffect(() => {
    fetch("http://localhost/api/problems/48ffb0999c0d4a179ac6aa65c299ccf4")
      .then((res) => res.json())
      .then((res) => {
        if (res) setProblem(res[0]);
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
            as={Link}
            to={`/blue/problems/${problem?.id}/submit`}
            trigger={<Button content="Submit" icon="upload" />}
            content="Submit"
            position="top center"
            inverted
          />
          <Popup
            trigger={<Button content="Stats" icon="chart bar" />}
            content="Stats"
            position="top center"
            inverted
          />
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
