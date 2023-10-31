import type { IClarification } from "abacus"
import { ClarificationRepository } from 'api'
import { AppContext } from 'context'
import React, { useContext, useState } from "react"
import { Button, ButtonProps, Comment, Form, Message, Popup } from "semantic-ui-react"
import { ClarificationComment, ClarificationContext } from "."

const ClarificationView = ({ clarification }: { clarification?: IClarification }): React.JSX.Element => {
  const { user } = useContext(AppContext)
  const { reloadClarifications, activeItem } = useContext(ClarificationContext)
  const clarificationRepo = new ClarificationRepository()
  const [body, setBody] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const handleSubmit = async () => {
    setReplyLoading(true)

    const response = await clarificationRepo.create({ 'parent': activeItem, body })

    if (response.ok) {
      await reloadClarifications()
      setBody('')
    }
    setReplyLoading(false)
  }

  const handleLock = async (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, { value: open }: ButtonProps) => {
    if (!activeItem) return

    const response = await clarificationRepo.update(activeItem, open)

    if (response.ok) {
      await reloadClarifications()
    }
  }

  if (activeItem === '') return <p className="prompt">No clarification selected. Pick a clarification to view.</p>

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
        {clarification.children?.length ? (
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
            <Form.TextArea name="body" value={body} onChange={({ target: { value } }) => setBody(value)} />
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