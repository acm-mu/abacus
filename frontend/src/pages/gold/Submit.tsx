import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Select, Label } from "semantic-ui-react";
import { Block } from "../../components";
import { UserContext } from "../../context/user";
import config from "../../environment"
import { ProblemType } from "../../types";

const Submit = (): JSX.Element => {
  const [problems, setProblems] = useState<ProblemType[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=gold`)
      .then(res => res.json())
      .then(res => setProblems(Object.values(res)))
  }, [])

  return (
    <>
      <Block size='xs-12'>
        <Form>
          <Input value="scratch" style={{ display: 'none' }} />
          <Input style={{ display: 'none' }} value={user?.scratch_username} />

          <Form.Group widths='equal'>
            <Form.Field label='Problem' control={Select} />
            {problems.map((problem) => {
              <option value={problem.pid}>{problem.name}</option>
            })}
            <Form.Field label='Scratch URL' control={Input}
              placeholder="https://scratch.mit.edu/projects/<project_id>" value={`https://scratch.mit.edu/projects/{project_id}`} />

            <Form.Field control={Input} />
          </Form.Group>
        </Form>
      </Block>

      <Block size='xs-12'>
        <h1>Project Title: <i>title</i></h1>
        <Label>Project Id <div className="detail">#%id%</div></Label>
        <Label>Created <div className="detail">%created_date%</div></Label>
        <Label>Modified <div className="detail">%modified_date%</div></Label>
        <br />
        <br />
        <Label>Public</Label>
        <Label>Published</Label>
        <a className="ui label" target='_blank' rel="noreferrer" href='https://scratch.mit.edu/projects/%id%'><i className="linkify icon"></i> Link to Project</a>
        <p>%description%</p>

        {/* <iframe id='scratch_embedded' src="https://scratch.mit.edu/projects/%id%/embed" allowtransparency="true" width="603"
        height="500" frameborder="0" scrolling="no" allowfullscreen></iframe> */}

      </Block>

      <Block size='xs-12'>
        <h2 style={{ textAlign: 'center' }}>⚠️ Cannot access project! ⚠️</h2>
        <br />
        <p>Please make sure you are sharing your project on scratch in order for the judges to view and assess</p>
        <h3>Need help?</h3>
        <a href='/help/scratch_share'>Sharing Projects on Scratch</a>
      </Block>
    </>
  )
}

export default Submit