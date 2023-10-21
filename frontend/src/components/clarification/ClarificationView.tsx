import { AppContext, ClarificationContext } from 'context'
import config from 'environment'
import React, { useContext, useMemo, useState } from 'react'
import { Button, ButtonProps, Comment, Form, Message, Popup } from 'semantic-ui-react'
import ClarificationComment from "./ClarificationComment"

const ClarificationView = () => {
  const { user } = useContext(AppContext)
  const { selectedItem, clarifications, reloadClarifications } = useContext(ClarificationContext)
  const [body, setBody] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const clarification = useMemo(() => clarifications?.find(c => c.cid == selectedItem), [clarifications, selectedItem])

  const handleChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setBody(value)

  const handleSubmit = async () => {
    setReplyLoading(true)
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        parent: selectedItem,
        body
      })
    })

    if (response.ok) {
      await reloadClarifications()
      setBody('')
    }
    setReplyLoading(false)
  }

  const handleLock = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ cid: selectedItem, open })
    })
    if (response.ok) {
      reloadClarifications()
    }
  }

  if (selectedItem === '') return <p className="prompt">No clarification selected. Pick a
    clarification to view.</p>

  if (!clarification) return <p className="prompt">Clarification not found!</p>

  // Can only comment if open and user is judge, admin, or author
  const canComment = clarification.open && (user?.role !== 'team' || clarification.user.uid == user?.uid)

  return (
    <>
      {user?.role == 'admin' || user?.role == 'judge' ? (
        clarification?.open ? (
          <Popup
            trigger={<Button floated="right" icon="unlock" value={false} onClick={handleLock} />}
            content="Close Clarification"
          />
        ) : (
          <Popup
            trigger={<Button floated="right" icon="lock" value={true} onClick={handleLock} />}
            content="Reopen Clarification"
          />
        )
      ) : (
        <></>
      )}

      <Comment.Group>
        <ClarificationComment clarification={clarification} />
        {clarification.children.length > 0 ? (
          <Comment.Group>
            {clarification.children
              .sort(({ date: d1 }, { date: d2 }) => d1 - d2)
              .map((child) => (
                <ClarificationComment key={child.cid} clarification={child} />
              ))}
          </Comment.Group>
        ) : (
          <></>
        )}
        {canComment ? (
          <Form reply>
            <Form.TextArea name="body" value={body} onChange={handleChange} />
            <Button
              loading={replyLoading}
              disabled={replyLoading}
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
    </>
  )
}


export default ClarificationView