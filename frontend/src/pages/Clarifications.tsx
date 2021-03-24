import React, { useContext, useEffect, useState } from 'react';
import { Button, Comment, Form, Grid, Header, Label, List, Loader, Menu, MenuItemProps, Segment, TextAreaProps } from 'semantic-ui-react';
import { Clarification } from 'abacus';
import config from '../environment'
import Moment from 'react-moment';
import './Clarifications.scss'
import { Block } from 'components';
import { response } from 'express';
import AppContext from 'AppContext';

interface ClarificationCommentProps {
  clarification: Clarification
}

const ClarificationComment = ({ clarification }: ClarificationCommentProps) => {
  return <Comment>
    <Comment.Content>
      <Comment.Author as='a'>{clarification.user.display_name}</Comment.Author>
      <Comment.Metadata>
        <div><Moment fromNow date={clarification.date * 1000} /></div>
      </Comment.Metadata>
      <Comment.Text>{clarification.body}</Comment.Text>
    </Comment.Content>
  </Comment>
}

const Clarifications = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [clarifications, setClarifications] = useState<{ [key: string]: Clarification }>()
  const [activeItem, setActiveItem] = useState('')
  const [body, setBody] = useState('')

  const loadClarifications = async () => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })
    if (response.ok) {
      const clarifs: { [key: string]: Clarification } = await response.json()
      if (clarifs && Object.values(clarifs).length > 0) {
        setActiveItem(Object.values(clarifs)[0].cid)
      }
      setClarifications(clarifs)
    } else {
      setClarifications({})
    }

    setLoading(false)
  }

  useEffect(() => {
    loadClarifications()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps) => {
    if (name) {
      setActiveItem(name)
      setBody('')
    }
  }

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(value)
  }

  const handleSubmit = async () => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        parent: activeItem, body
      })
    })

    if (response.ok) {
      loadClarifications()
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({ cid: activeItem })
    })
    if (response.ok) {
      loadClarifications()
    }
  }

  if (isLoading) return <Loader active inline='centered' />

  let clarification: Clarification | undefined = undefined
  if (clarifications && Object.keys(clarifications).includes(activeItem))
    clarification = clarifications[activeItem]

  return <Block size='xs-12' transparent>
    <h2>Clarifications</h2>
    {!clarifications || Object.values(clarifications).length == 0 ? <p>There are no active clarifications right now!</p> :
      <Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={3}>
              <Menu secondary vertical>
                {clarifications && Object.values(clarifications).map((clarification: Clarification) =>
                  <Menu.Item
                    name={clarification.cid}
                    onClick={handleClick}
                    key={clarification.cid}
                    active={activeItem == clarification.cid}
                  >
                    <Header as='h5'>{clarification.title}</Header>
                    {clarification.user.display_name} {' '}
                    <Moment fromNow date={clarification.date * 1000} />

                  </Menu.Item>)}
              </Menu>
            </Grid.Column>
            <Grid.Column width={13}>
              <Comment.Group>
                {clarification ? <>
                  <ClarificationComment clarification={clarification} />
                  {clarification.children.length > 0 ? <Comment.Group>
                    {clarification.children
                      .sort(({ date: d1 }, { date: d2 }) => d1 - d2)
                      .map((child) =>
                        <ClarificationComment key={child.cid} clarification={child} />)}
                  </Comment.Group> : <></>}
                  <Form reply>
                    <Form.TextArea
                      name='body'
                      value={body}
                      onChange={handleChange}
                    />
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary onClick={handleSubmit} />
                    {user?.role == 'admin' ? <Button content='Delete' labelPosition='left' icon='trash' negative onClick={handleDelete} /> : <></>}
                  </Form>
                </> : <></>}
              </Comment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>}
  </Block>
}

export default Clarifications