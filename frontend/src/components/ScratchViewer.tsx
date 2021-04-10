import React, { useEffect, useState } from 'react';
import config from 'environment'
import { Checkbox, CheckboxProps, Form, Grid, Header, Icon, Label, Segment, TextArea } from 'semantic-ui-react';
import Moment from 'react-moment';
import "./ScratchViewer.scss"

interface ScratchViewerProps {
  project_id?: string;
}

interface ScratchProject {
  title: string,
  description: string,
  public: boolean,
  visibility: string,
  is_published: boolean,
  author: {
    username: string
  },
  history: {
    created: string,
    modified: string,
    shared: string
  }
}

const ScratchViewer = ({ project_id }: ScratchViewerProps): JSX.Element => {
  const [project, setProject] = useState<ScratchProject>()
  const [score, setScore] = useState<number>()

  useEffect(() => {
    fetch(`${config.API_URL}/scratch/project?project_id=${project_id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(() => setProject(undefined))
  }, [project_id])

  const handleScoreChange = (event: React.FormEvent<HTMLInputElement>, { value }: CheckboxProps) => setScore(value as number)

  if (project_id == undefined) return <></>

  if (!project) {
    return <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        <p>We can not find a project with that id.</p>
        <p>Please make sure your project is public and published.</p>
      </Header>
    </Segment>
  }

  return <Grid columns={2} stackable>
    <Grid.Row>
      <Grid.Column textAlign='center'>
        <iframe src={`https://scratch.mit.edu/projects/${project_id}/embed`} width="485" height="402" frameBorder="0" scrolling="no" allowFullScreen />
      </Grid.Column>

      <Grid.Column className='scratch-info'>
        <>
          {project ? <Segment>
            <a target='_blank' rel='noreferrer' href={`https://scratch.mit.edu/projects/${project_id}`}><h2>{project.title}</h2> {project.author.username}</a>
            <p>{project.description}</p>

            <div className='history'>
              <span>Created<br /> <Label><Moment fromNow date={Date.parse(project.history.created)} /></Label></span>
              <span>Modified<br /> <Label><Moment fromNow date={Date.parse(project.history.modified)} /></Label></span>
              <span>Shared<br /> <Label><Moment fromNow date={Date.parse(project.history.shared)} /></Label></span>
            </div>
          </Segment> : <></>}
          <Segment>
            <h1>Feedback</h1>
            <Form>
              <Form.Group inline>
                <label>Score</label>
                <Checkbox radio name='score' label='1' value={1} checked={score == 1} onChange={handleScoreChange} />
                <Checkbox radio name='score' label='2' value={2} checked={score == 2} onChange={handleScoreChange} />
                <Checkbox radio name='score' label='3' value={3} checked={score == 3} onChange={handleScoreChange} />
                <Checkbox radio name='score' label='4' value={4} checked={score == 4} onChange={handleScoreChange} />
                <Checkbox radio name='score' label='5' value={5} checked={score == 5} onChange={handleScoreChange} />
              </Form.Group>
              <Form.Field control={TextArea} label='Comments' />
            </Form>
          </Segment>
        </>
      </Grid.Column>
    </Grid.Row>
  </Grid>
}

export default ScratchViewer