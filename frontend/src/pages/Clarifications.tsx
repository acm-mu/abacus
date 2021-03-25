import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonProps, Comment, Form, Grid, Header, Icon, Label, Loader, Menu, MenuItemProps, Popup, Segment } from 'semantic-ui-react';
import { Clarification } from 'abacus';
import config from '../environment'
import Moment from 'react-moment';
import './Clarifications.scss'
import { Block } from 'components';
import AppContext from 'AppContext';
import { useParams } from 'react-router-dom';

interface ClarificationCommentProps {
  clarification: Clarification
}

const Clarifications = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [clarifications, setClarifications] = useState<{ [key: string]: Clarification }>()
  const { cid } = useParams<{ cid: string }>()
  const [activeItem, setActiveItem] = useState<string>(cid || '')
  const [body, setBody] = useState('')

  const loadClarifications = async (): Promise<{ [key: string]: Clarification }> => {
    let clarifications = {}
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (response.ok) {
      clarifications = await response.json()
    }

    setClarifications(clarifications)
    setLoading(false)

    return clarifications
  }

  useEffect(() => {
    loadClarifications().then((clarifications: { [key: string]: Clarification }) => {
      setActiveItem(Object.values(clarifications).sort((c1, c2) => c2.date - c1.date)[0].cid)
    })
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
      await loadClarifications()
      setBody('')
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

  const handleLock = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ cid: activeItem, open })
    })
    if (response.ok) {
      loadClarifications()
    }
  }


  const deleteClarification = async (cid: string) => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({ cid })
    })
    if (response.ok) {
      loadClarifications()
    }
  }
  const ClarificationComment = ({ clarification }: ClarificationCommentProps) => {
    return <Comment>
      <Comment.Content>
        <Comment.Author as='a'>{clarification.user.display_name}</Comment.Author>
        <Comment.Metadata>
          <div><Moment fromNow date={clarification.date * 1000} /></div>
        </Comment.Metadata>
        <Comment.Text>{clarification.body}
          {clarification.parent != undefined ? <a href='#' onClick={() => deleteClarification(clarification.cid)}>Delete</a> : <></>}
        </Comment.Text>
      </Comment.Content>
    </Comment>
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
            <Grid.Column width={4}>
              <Menu secondary vertical style={{ width: '100%' }}>
                {clarifications && Object.values(clarifications).sort((c1, c2) => c2.date - c1.date).map((clarification: Clarification) =>
                  <Menu.Item
                    name={clarification.cid}
                    onClick={handleClick}
                    key={clarification.cid}
                    active={activeItem == clarification.cid}
                    className={`${clarification.open ? 'open' : 'closed'}`}
                  >
                    <Header as='h5'>{clarification.title}
                      {!clarification.open ? <Icon name='lock' /> : clarification.type == 'private' ? <Popup content="Private" trigger={<Icon name='eye slash' />} /> : <></>}</Header>
                    {user?.uid == clarification.user.uid ? "You" : clarification.user.display_name} {' '}
                    <Moment fromNow date={clarification.date * 1000} />
                  </Menu.Item>)}
              </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
              {clarification ? <div style={{ float: 'right' }}>
                {user?.role == 'admin' ? <Popup trigger={<Button icon='trash' negative onClick={handleDelete} />} content='Delete Clarification' /> : <></>}
                {user?.role == 'admin' || user?.role == 'judge' ? (clarification?.open ?
                  <Popup trigger={<Button icon='lock' value={false} onClick={handleLock} />} content='Close Clarification' /> :
                  <Popup trigger={<Button icon='unlock' value={true} onClick={handleLock} />} content='Reopen Clarification' />) : <></>}
              </div> : <></>}
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
                    {(user?.role !== 'team' || clarification.user.uid == user?.uid) && clarification.open ? <>
                      <Form.TextArea
                        name='body'
                        value={body}
                        onChange={handleChange}
                      />
                      <Button content='Add Reply' labelPosition='left' icon='edit' primary onClick={handleSubmit} />
                    </> : <p>Replying to this clarification is disabled</p>}
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