import React, { ChangeEvent, SyntheticEvent, useContext, useState } from 'react'
import { Button, DropdownProps, Form, Modal } from 'semantic-ui-react'
import config from 'environment'
import { AppContext } from 'context'
import { useNavigate } from 'react-router-dom'
import { divisions } from 'utils'
import { Clarification, Context } from 'abacus'
import { StatusMessage } from '.'

interface ClarificationModalProps {
  trigger: React.JSX.Element
  title?: string
  context?: Context
  callback?: (clarification: Clarification) => void
  onCreate?: () => void;
}

const ClarificationModal = ({ trigger, title = '', context }: ClarificationModalProps): React.JSX.Element => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const [clarification, setClarification] = useState({
    title,
    context,
    body: '',
    division: user?.division ?? ''
  })

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setClarification({ ...clarification, [name]: value })
  const handleDropdownChange = (event: SyntheticEvent<HTMLElement, Event>, { name, value }: DropdownProps) =>
    setClarification({ ...clarification, [name]: value })

  const handleSubmit = async () => {
    setLoading(true)
    const response = await fetch(`${config.API_URL}/clarifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.accessToken}` },
      body: JSON.stringify(clarification)
    })

    if (response.ok) {
      const { cid } = await response.json()

      if (user?.role === 'admin') {
        navigate(`/admin/clarifications/${cid}`)
      } else {
        navigate(`/${user?.division}/clarifications/`)
      }

      setClarification({
        title: '',
        body: '',
        context: undefined,
        division: user?.division ?? ''
      })
      setOpen(false)
    } else {
      const body = await response.json()
      setError(body.message)

      setTimeout(() => {
        setError(undefined)
      }, 5 * 1000)
    }
    setLoading(false)
  }

  return (
    <Modal
      size="tiny"
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={isOpen}
      trigger={trigger}>
      <Modal.Header>
        {user?.role == 'admin' || user?.role == 'judge' ? 'New Public Clarification' : 'Ask a Clarification'}
      </Modal.Header>
      <Modal.Description>
        {error ? <StatusMessage message={{ type: 'error', message: error }} /> : <></>}

        <Form style={{ padding: '1em' }}>
          <Form.Input label="Title" name="title" value={clarification.title} onChange={handleChange} />
          {user?.role == 'admin' ? (
            <Form.Select
              label="Division"
              placeholder="Division"
              name="division"
              value={clarification.division}
              onChange={handleDropdownChange}
              options={[...divisions, { key: 'public', text: 'Public', value: 'public' }]}
            />
          ) : (
            <></>
          )}
          <Form.TextArea label="Description" name="body" value={clarification.body} onChange={handleChange} />
        </Form>
      </Modal.Description>
      <Modal.Actions>
        <Button disabled={isLoading} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button loading={isLoading} disabled={isLoading} primary onClick={handleSubmit}>
          Send
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ClarificationModal
