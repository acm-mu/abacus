import { Clarification } from 'abacus';
import AppContext from 'AppContext';
import { Block, NotFound } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, ButtonProps, Comment, Form, Label, Loader, Message, Popup } from 'semantic-ui-react';
import config from '../../environment'

interface ClarificationProps {
  clarification: Clarification
}

const ClarificationPage = (): JSX.Element => {
  const history = useHistory()
  const { user } = useContext(AppContext)
  const { cid } = useParams<{ cid: string }>()
  const [clarification, setClarification] = useState<Clarification>()
  const [body, setBody] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)

  const loadClarification = async () => {
    const response = await fetch(`${config.API_URL}/clarifications?cid=${cid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    if (response.ok && isMounted) {
      const clarifications: Clarification[] = Object.values(await response.json())
      if (clarifications.length > 0) setClarification(clarifications[0])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadClarification()
    return () => { setMounted(false) }
  }, [])

  const handleSubmit = async () => {
    if (!clarification) { alert('Invalid clarification'); return }

    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ parent: clarification.cid, body })
    })

    if (response.ok) {
      await loadClarification()
      setBody('')
    }
  }

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setBody(value)

  const handleDelete = async () => {
    if (!clarification) { alert('Invalid clarification'); return }

    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({ cid: clarification.cid })
    })
    if (response.ok) {
      history.push('/admin/clarifications')
    }
  }

  const handleLock = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    if (!clarification) { alert('Invalid clarification!'); return }

    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ cid: clarification.cid, open })
    })
    if (response.ok) {
      loadClarification()
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
      loadClarification()
    }
  }

  const ClarificationComment = ({ clarification }: ClarificationProps) => {
    return <Comment>
      <Comment.Content>
        <Comment.Author as='a'>{clarification.user.display_name}</Comment.Author>
        <Comment.Metadata>
          <div><Moment fromNow date={clarification.date * 1000} /></div>
          {clarification.parent != undefined ? <a href='#' onClick={() => deleteClarification(clarification.cid)}>Delete</a> : <></>}
        </Comment.Metadata>
        <Comment.Text>{clarification.body}</Comment.Text>
      </Comment.Content>
    </Comment>
  }

  if (isLoading) return <Loader active inline='centered' />
  if (!clarification) return <NotFound />

  return <>
    <Block transparent size='xs-12'>
      <Breadcrumb>
        <Breadcrumb.Section as={Link} to='/admin/clarifications' content="Clarifications" />
        <Breadcrumb.Divider />
        <Breadcrumb.Section active content={clarification.title} />
      </Breadcrumb>
    </Block>

    <Block size='xs-12'>
      <div style={{ float: 'right' }}>
        {user?.role == 'admin' ? <Popup trigger={<Button icon='trash' negative onClick={handleDelete} />} content='Delete Clarification' /> : <></>}
        {user?.role == 'admin' || user?.role == 'judge' ? (clarification?.open ?
          <Popup trigger={<Button icon='lock' value={false} onClick={handleLock} />} content='Close Clarification' /> :
          <Popup trigger={<Button icon='unlock' value={true} onClick={handleLock} />} content='Reopen Clarification' />) : <></>}
      </div>
      <h1 style={{ display: 'inline' }}>{clarification.title} {!clarification.open ? <Label content="Closed" /> : <></>}</h1>
      <Comment.Group>
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
              onChange={handleChange} />
            <Button content='Add Reply' labelPosition='left' icon='edit' primary onClick={handleSubmit} />
          </> : <Message color='yellow' icon='exclamation triangle' header='Clarification is closed!' content='Responding is disabled' />}
        </Form>
      </Comment.Group>
    </Block>
  </>
}

export default ClarificationPage