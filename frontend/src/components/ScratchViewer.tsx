import React, { useEffect, useState } from 'react';
import config from 'environment'
import { Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
  }
}

const ScratchViewer = ({ project_id }: ScratchViewerProps): JSX.Element => {
  const [project, setProject] = useState<ScratchProject>()

  useEffect(() => {
    fetch(`${config.API_URL}/scratch/project?project_id=${project_id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(() => setProject(undefined))
  }, [project_id])

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
      <Grid.Column>
        <iframe src={`https://scratch.mit.edu/projects/${project_id}/embed`} allowTransparency width="485" height="402" frameBorder="0" scrolling="no" allowFullScreen />
      </Grid.Column>

      <Grid.Column>
        {project ? <>
          <Link to=''><h2>{project.title}</h2></Link>
          <h3><b>Author</b> <a href='#'>{project.author.username}</a></h3>
          <p>{project.description}</p>
          <div>
            {project.is_published ? <Label content='Published' icon='check' color='green' /> : <Label content="Unpublished" icon='cross' color='red' />}
            {project.public ? <Label content='Public' icon='check' color='green' /> : <Label content="Private" icon='cross' color='red' />}
            {project.visibility == 'visible' ? <Label content='Visible' icon='check' color='green' /> : <Label content="Not visible" icon='cross' color='red' />}
          </div>
        </> : <></>}
      </Grid.Column>
    </Grid.Row>
  </Grid>
}

export default ScratchViewer