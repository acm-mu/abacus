import type { ISettings } from "abacus"
import { ContestService } from 'api'
import { Block, PageLoading, StatusMessage } from 'components'
import { StatusMessageType } from 'components/StatusMessage'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'

const timezoneOffset = () => new Date().getTimezoneOffset() * 60 * 1000

const toLocal = (date: Date = new Date()): Date => new Date(date.getDate() * 1000 - timezoneOffset())

const toLocalDateString = (date?: Date): string => toLocal(date).toISOString().substring(0, 10)
const toLocalTimeString = (date?: Date): string => toLocal(date).toISOString().substring(11, 16)

const Settings = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Settings")

  const contestService = new ContestService()

  const [settings, setSettings] = useState<ISettings>()

  const [isLoading, setLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState<StatusMessageType>()

  useEffect(() => {
    loadSettings()
  }, [])

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    // setSettings({ ...settings, [name]: value })
    throw new Error("This method has not been implemented!")
  }

  const loadSettings = async () => {
    setLoading(true)

    const response = await contestService.getSettings()

    if (response.ok && response.data) {
      setSettings(response.data)
    }

    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!settings) {
      return
    }

    setSaving(true)

    const response = await contestService.updateSettings(settings)

    if (response.ok) {
      setMessage({ type: 'success', message: 'Settings saved successfully!' })
    } else {
      setMessage({ type: 'error', message: response.errors })
    }

    setSaving(false)
  }

  if (isLoading) return <PageLoading />

  return <Block center size="xs-6">
    <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />
    <Form onSubmit={handleSubmit}>
      <h1>Settings</h1>
      <hr />

      <h3>Competition Settings</h3>

      <Form.Input
        label="Competition Display Name"
        type="text"
        required
        onChange={handleChange}
        value={settings?.competition_name ?? ''}
        name="competition_name"
      />

      <Form.Input
        label="Practice Display Name"
        type="text"
        required
        onChange={handleChange}
        value={settings?.practice_name ?? ''}
        name="practice_name"
      />

      <h3>Practice Period</h3>

      <Form.Group widths="equal">
        <Form.Field
          label="Start Date"
          control={Input}
          type="date"
          onChange={handleChange}
          name="practice_start_date"
          value={toLocalDateString(settings?.practice_start_date)}
        />
        <Form.Field
          label="Start Time"
          control={Input}
          type="time"
          onChange={handleChange}
          name="practice_start_time"
          value={toLocalTimeString(settings?.practice_start_date)}
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Field
          label="End Date"
          control={Input}
          type="date"
          onChange={handleChange}
          name="practice_end_date"
          value={toLocalDateString(settings?.practice_end_date)}
        />
        <Form.Field
          label="End Time"
          control={Input}
          type="time"
          onChange={handleChange}
          name="practice_end_time"
          value={toLocalDateString(settings?.practice_end_date)}
        />
      </Form.Group>

      <h3>Competition Time</h3>

      <Form.Group widths="equal">
        <Form.Field
          label="Start Date"
          control={Input}
          type="date"
          onChange={handleChange}
          name="start_date"
          value={toLocalDateString(settings?.start_date)}
        />
        <Form.Field
          label="Start Time"
          control={Input}
          type="time"
          onChange={handleChange}
          name="start_time"
          value={toLocalTimeString(settings?.start_date)}
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Field
          label="End Date"
          control={Input}
          type="date"
          onChange={handleChange}
          name="end_date"
          value={toLocalDateString(settings?.end_date)}
        />
        <Form.Field
          label="End Time"
          control={Input}
          type="time"
          onChange={handleChange}
          name="end_time"
          value={toLocalTimeString(settings?.end_date)}
        />
      </Form.Group>

      <h3>Scoring System</h3>
      <Form.Field
        label="Points per Yes"
        control={Input}
        type="number"
        name="points_per_yes"
        value={settings?.points_per_yes ?? 0}
        onChange={handleChange}
      />
      <Form.Field
        label="Points per No"
        control={Input}
        type="number"
        name="points_per_no"
        value={settings?.points_per_no ?? 0}
        onChange={handleChange}
      />
      <Form.Field
        label="Points per Compilation Error"
        control={Input}
        type="number"
        name="points_per_compilation_error"
        value={settings?.points_per_compilation_error ?? 0}
        onChange={handleChange}
      />
      <Form.Field
        label="Points per Minute (1st Yes)"
        control={Input}
        type="number"
        name="points_per_yes"
        value={settings?.points_per_minute ?? 0}
        onChange={handleChange}
      />

      <Button primary loading={isSaving} disabled={isSaving}>
        Save
      </Button>
    </Form>
  </Block>
}

export default Settings
