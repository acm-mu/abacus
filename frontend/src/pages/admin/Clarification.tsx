import { Clarification, Submission } from 'abacus';
import { AppContext } from 'context';
import { Block, DivisionLabel, NotFound, PageLoading } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Moment from 'react-moment';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, ButtonProps, Comment, Divider, Form, Label, Message, Table } from 'semantic-ui-react';
import config from '../../environment'
import './Clarification.scss'

interface ClarificationProps {
  clarification: Clarification
}

const ClarificationPage = (): JSX.Element => {
  const history = useHistory()
  const { user } = useContext(AppContext)
  const { cid } = useParams<{ cid: string }>()
  const [clarification, setClarification] = useState<Clarification>()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [body, setBody] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [isChangingState, setChangingState] = useState(false)
  const [isReplying, setReplying] = useState(false)

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

  const loadSubmissions = async () => {
    const response = await fetch(`${config.API_URL}/submissions?tid=${clarification?.user.uid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    const submissions = Object.values(await response.json()) as Submission[]

    if (!isMounted) return

    setSubmissions(submissions.map(submission => ({ ...submission, checked: false })))
    setLoading(false)
  }

  useEffect(() => {
    loadClarification()
    if (clarification) loadSubmissions()
    return () => { setMounted(false) }
  }, [])

  const handleSubmit = async () => {
    if (!clarification) { alert('Invalid clarification'); return }

    setReplying(true)
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
    setReplying(false)
  }

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setBody(value)

  const handleLock = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    if (!clarification) { alert('Invalid clarification!'); return }

    setChangingState(true)
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
    setChangingState(false)
  }

  const ClarificationComment = ({ clarification }: ClarificationProps) => {

    const deleteClarification = () => {
      fetch(`${config.API_URL}/clarifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
          'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({ cid: clarification.cid })
      }).then((response) => {
        if (response.ok) {
          if (clarification.cid == cid) history.push('/admin/clarifications')
          else loadClarification()
        }
      })
    }

    return <Comment>
      <Comment.Content>
        <Comment.Author as='a'>{clarification.user.display_name}</Comment.Author>
        <Comment.Metadata>
          <div><Moment fromNow date={clarification.date * 1000} /></div>
          <a href='#' onClick={deleteClarification}>Delete</a>
        </Comment.Metadata>
        <Comment.Text>{clarification.body}</Comment.Text>
      </Comment.Content>
    </Comment>
  }

  const goBack = () => { history.push('/admin/clarifications') }

  if (isLoading) return <PageLoading />
  if (!clarification) return <NotFound />

  return <>
    <Helmet><title>Abacus | Admin {clarification.title}</title></Helmet>
    <h1 style={{ display: 'inline' }}>{clarification.title} {!clarification.open ? <Label color='red' content="Closed" className='closed' /> : <Label color='green' content='Active' className='active' />}</h1>
    <Block transparent size='xs-12'>
      <Button content='Back' icon='arrow left' labelPosition='left' onClick={goBack} />
      {user?.role == 'admin' || user?.role == 'judge' ?
        (clarification?.open ?
          <Button value={false} icon='unlock' content='Close' labelPosition='left' onClick={handleLock} loading={isChangingState} disabled={isChangingState} /> :
          <Button value={true} icon='lock' content='Reopen' labelPosition='left' onClick={handleLock} loading={isChangingState} disabled={isChangingState} />
        ) : <></>}
    </Block>

    <Block size='xs-6'>
      <Comment.Group>
        <ClarificationComment clarification={clarification} />
        {clarification.children.length > 0 ?
          <Comment.Group>
            {clarification.children
              .sort(({ date: d1 }, { date: d2 }) => d1 - d2)
              .map((child) =>
                <ClarificationComment key={child.cid} clarification={child} />)}
          </Comment.Group> : <></>
        }
        {clarification.open ?
          <Form reply>
            <Form.TextArea
              name='body'
              value={body}
              onChange={handleChange} />
            <Button loading={isReplying} disabled={isReplying} content='Add Reply' labelPosition='left' icon='edit' primary onClick={handleSubmit} />
          </Form> :
          <Message
            warning
            icon='exclamation'
            header='Notice'
            content='Replying to this clarification is disabled.'
          />}
      </Comment.Group>
    </Block>
    <Block size='xs-6'>
      <h2 style={{ display: 'inline' }}><Link to={`/admin/users/${clarification.user.uid}`}>{clarification.user.display_name}</Link> <DivisionLabel division={clarification.division} /></h2>
      <h4>School: {clarification.user.school}</h4>
      <Divider />
      <h4>Last 5 Submissions:</h4>
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Submission ID</Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Submission #</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.length == 0 ?
            <Table.Row>
              <Table.Cell colSpan={'100%'} style={{ textAlign: "center" }}>No Submissions</Table.Cell>
            </Table.Row> :
            submissions.map((submission: Submission) =>
              <Table.Row key={submission.sid}>
                <Table.Cell><Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link></Table.Cell>
                <Table.Cell><Link to={`/admin/problems/${submission.pid}`}>{submission.problem?.name} </Link></Table.Cell>
                <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                <Table.Cell><span className={`icn ${submission.status}`} /></Table.Cell>
              </Table.Row>)}
        </Table.Body>
      </Table>
    </Block>
  </>
}

export default ClarificationPage