import type { IClarification, ISubmission } from 'abacus'
import { ClarificationRepository, SubmissionRepository } from "api"
import { Block, DivisionLabel, NotFound, PageLoading } from 'components'
import { ClarificationComment } from "components/clarification"
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, ButtonProps, Comment, Divider, Form, Label, Message, Table } from 'semantic-ui-react'
import './Clarification.scss'

const ClarificationPage = (): React.JSX.Element => {
  const submissionRepo = new SubmissionRepository()
  const clarificationRepo = new ClarificationRepository()

  const navigate = useNavigate()
  const { user } = useContext(AppContext)
  const { cid } = useParams<{ cid: string }>()
  const [clarification, setClarification] = useState<IClarification>()
  const [submissions, setSubmissions] = useState<ISubmission[]>([])
  const [body, setBody] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)
  const [isChangingState, setChangingState] = useState(false)
  const [isReplying, setReplying] = useState(false)

  usePageTitle(`Abacus | Admin ${clarification?.title ?? ""}`)

  const loadClarification = async () => {
    if (!cid) return
    const response = await clarificationRepo.get(cid)

    if (response.ok) {
      setClarification(response.data)
    }
    setLoading(false)
  }

  const loadSubmissions = async () => {
    const response = await submissionRepo.getMany({
      filterBy: {
        teamId: clarification?.user.uid
      }
    })

    if (!isMounted) return

    if (response.data) {
      setSubmissions(Object.values(response.data).map(submission => ({ ...submission, checked: false })) ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadClarification().catch(console.error)
    if (clarification) loadSubmissions().catch(console.error)
    return () => {
      setMounted(false)
    }
  }, [])

  const handleSubmit = async () => {
    if (!clarification) {
      alert('Invalid clarification')
      return
    }

    setReplying(true)
    const response = await clarificationRepo.create({ parent: clarification.cid, body })

    if (response.ok) {
      await loadClarification()
      setBody('')
    }
    setReplying(false)
  }

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setBody(value)

  const handleLock = async (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    if (!clarification) {
      alert('Invalid clarification!')
      return
    }

    setChangingState(true)
    const response = await clarificationRepo.update(clarification.cid, { open })

    if (response.ok) {
      await loadClarification()
    }
    setChangingState(false)
  }

  const goBack = () => {
    navigate('/admin/clarifications')
  }

  if (isLoading) return <PageLoading />
  if (!clarification) return <NotFound />

  return (
    <>
      <h1 style={{ display: 'inline' }}>
        {clarification.title} {!clarification.open ? (
        <Label color="red" content="Closed" className="closed" />
      ) : (
        <Label color="green" content="Active" className="active" />
      )}
      </h1>
      <Block transparent size="xs-12">
        <Button content="Back" icon="arrow left" labelPosition="left" onClick={goBack} />
        {user?.role == 'admin' || user?.role == 'judge' ? (
          clarification?.open ? (
            <Button
              value={false}
              icon="unlock"
              content="Close"
              labelPosition="left"
              onClick={handleLock}
              loading={isChangingState}
              disabled={isChangingState}
            />
          ) : (
            <Button
              value={true}
              icon="lock"
              content="Reopen"
              labelPosition="left"
              onClick={handleLock}
              loading={isChangingState}
              disabled={isChangingState}
            />
          )
        ) : (
          <></>
        )}
      </Block>

      <Block size="xs-6">
        <Comment.Group>
          <ClarificationComment clarification={clarification} />
          {clarification.children?.length ? (
            <Comment.Group>
              {clarification.children
                .sort(({ date: d1 }, { date: d2 }) => d1 - d2)
                .map((child) => <ClarificationComment key={child.cid} clarification={child} />)}
            </Comment.Group>
          ) : (
            <></>
          )}
          {clarification.open ? (
            <Form reply>
              <Form.TextArea name="body" value={body} onChange={handleChange} />
              <Button
                loading={isReplying}
                disabled={isReplying}
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                primary
                onClick={handleSubmit}
              />
            </Form>
          ) : (
            <Message warning icon="exclamation" header="Notice" content="Replying to this clarification is disabled." />
          )}
        </Comment.Group>
      </Block>
      <Block size="xs-6">
        <h2 style={{ display: 'inline' }}>
          <Link to={`/admin/users/${clarification.user.uid}`}>{clarification.user.display_name}</Link> <DivisionLabel
          division={clarification.division} />
        </h2>
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
            {submissions.length == 0 ? (
              <Table.Row>
                <Table.Cell colSpan={'100%'} style={{ textAlign: 'center' }}>
                  No Submissions
                </Table.Cell>
              </Table.Row>
            ) : (
              submissions.map((submission: ISubmission) => (
                <Table.Row key={submission.sid}>
                  <Table.Cell>
                    <Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/problems/${submission.pid}`}>{submission.problem?.name} </Link>
                  </Table.Cell>
                  <Table.Cell>{submission.sub_no + 1}</Table.Cell>
                  <Table.Cell>
                    <span className={`icn ${submission.status}`} />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default ClarificationPage
