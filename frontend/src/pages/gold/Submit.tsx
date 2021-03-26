import { Problem } from "abacus";
import React, { useContext, useEffect, useState } from "react";
import { Form, Label, Loader, DropdownProps, InputOnChangeData } from "semantic-ui-react";
import AppContext from "AppContext";
import { Block } from "components";
import config from "environment"
import Moment from "react-moment";

const Submit = (): JSX.Element => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [problem, setProblem] = useState()
  const [project, setProject] = useState<{ [key: string]: any }>()
  const [projectUrl, setProjectUrl] = useState('`https://scratch.mit.edu/projects/{project_id}`')
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const { user } = useContext(AppContext)

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  const loadProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?division=gold`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (response.ok && isMounted) {
      setProblems(Object.values(await response.json()))
    }
    setLoading(false)
  }

  const handleProblemChange = (event: React.SyntheticEvent<HTMLElement, Event>, { key }: DropdownProps) => setProblem(key)

  const handleUrlChange = async (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
    setProjectUrl(value)

    const [, project_id] = value.match(/https:\/\/scratch\.mit\.edu\/projects\/(\d+)/) || ['', '']

    const response = await fetch(`${config.API_URL}/scratch/project?username=${user?.scratch_username}&project_id=${project_id}`)
    if (response.ok) {
      const problem = await response.json()
      if (!(problem instanceof Array))
        setProject(problem)
      console.log(problem)
    } else {
      setProject(undefined)
    }
  }

  if (isLoading) return <Loader inline='centered' active />

  return (
    <>
      <Block size='xs-12'>
        <Form>
          <Form.Group widths='equal'>
            <Form.Select
              label='Problem'
              placeholder='Problem'
              name='problem'
              value={problem}
              onChange={handleProblemChange}
              options={problems.map((problem) => ({ key: problem.pid, text: problem.name, value: problem.pid }))}
            />
            <Form.Input
              label='Scratch URL'
              onChange={handleUrlChange}
              placeholder="https://scratch.mit.edu/projects/<project_id>"
              value={projectUrl}
            />
          </Form.Group>
        </Form>
      </Block>

      {project !== undefined ?
        <Block size='xs-12'>
          <h1>Project Title: {project.title}</h1>
          <Label>Project Id <div className="detail">{project.id}</div></Label>
          <Label>Created <div className="detail"><Moment fromNow date={Date.parse(project.history.created)} /></div></Label>
          <Label>Modified <div className="detail"><Moment fromNow date={Date.parse(project.history.modified)} /></div></Label>
          <br />
          <br />
          {project.public ? <Label color='green'>Public</Label> : <Label color='red'>Not Public</Label>}
          {project.is_published ? <Label color='green'>Published</Label> : <Label color='red'>Not Published</Label>}
          <a className="ui label" target='_blank' rel="noreferrer" href={`https://scratch.mit.edu/projects/${project.id}`}><i className="linkify icon"></i> Link to Project</a>
          <p>{project.description}</p>

          <iframe src="https://scratch.mit.edu/projects/466969373/embed" allowTransparency width="485" height="402" frameBorder="0" scrolling="no" allowFullScreen />
        </Block>
        :
        <Block size='xs-12'>
          <h2 style={{ textAlign: 'center' }}>⚠️ Cannot access project! ⚠️</h2>
          <br />
          <p>Please make sure you are sharing your project on scratch in order for the judges to view and assess</p>
          <h3>Need help?</h3>
          <a href='/help/scratch_share'>Sharing Projects on Scratch</a>
        </Block>}
    </>
  )
}

export default Submit