import React, { ChangeEvent, SyntheticEvent, useContext, useState } from 'react';
import { Button, DropdownProps, Form, Message, Modal } from 'semantic-ui-react';
import config from 'environment';
import AppContext from 'AppContext';
import { useHistory } from 'react-router';
import { divisions } from 'utils';

interface ClarificationModalProps {
  trigger: JSX.Element
  title?: string
}

const ClarificationModal = ({ trigger, title = '' }: ClarificationModalProps): JSX.Element => {
  const history = useHistory()
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const [clarification, setClarification] = useState({
    title,
    body: '',
    division: user?.division || '',
  })

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setClarification({ ...clarification, [name]: value })
  const handleDropdownChange = (event: SyntheticEvent<HTMLElement, Event>, { name, value }: DropdownProps) => setClarification({ ...clarification, [name]: value })

  const handleSubmit = async () => {
    setLoading(true)
    const response = await fetch(`${config.API_URL}/clarifications`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.accessToken}` },
        body: JSON.stringify(clarification)
      })

    if (response.ok) {
      history.push(`/clarifications/`)
      setClarification({
        title: '',
        body: '',
        division: user?.division || '',
      })
      setOpen(false)
    } else {
      const body = await response.json()
      setError(body.message)

      setTimeout(() => { setError(undefined) }, 5 * 1000)
    }
    setLoading(false)
  }

  return <Modal size='tiny'
    closeIcon
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={isOpen}
    trigger={trigger}>
    <Modal.Header>{user?.role == "admin" || user?.role == "judge" ? "New Public Clarification" : "Ask a Clarification"}</Modal.Header>
    <Modal.Description>
      {error && <Message icon='warning circle' error attached='top' header="An error has occurred!" content={error} />}

      <Form style={{ padding: '1em' }}>
        <Form.Input
          label='Title'
          name='title'
          value={clarification.title}
          onChange={handleChange} />
        {user?.role == 'admin' ?
          <Form.Select
            label="Division"
            placeholder="Division"
            name='division'
            value={clarification.division}
            onChange={handleDropdownChange}
            options={[...divisions, { key: 'public', text: 'Public', value: 'public' }]}
          /> : <></>}
        <Form.TextArea
          label='Description'
          name='body'
          value={clarification.body}
          onChange={handleChange} />
      </Form>
    </Modal.Description>
    <Modal.Actions>
      <Button disabled={isLoading} onClick={() => setOpen(false)}>Cancel</Button>
      <Button loading={isLoading} disabled={isLoading} primary onClick={handleSubmit}>Send</Button>
    </Modal.Actions>
  </Modal>
}

export default ClarificationModal