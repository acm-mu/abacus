import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import { Block } from '../../components'
import config from '../../environment'

const timezoneOffset = () => (new Date()).getTimezoneOffset() * 60 * 1000

const toLocal = (date: number): Date => new Date((date * 1000) - timezoneOffset())

const toLocalDateString = (date: number): string => toLocal(date).toISOString().substring(0, 10)
const toLocalTimeString = (date: number): string => toLocal(date).toISOString().substring(11, 16)

const Settings = (): JSX.Element => {
  const [settings, setSettings] = useState<{ [key: string]: string }>({
    competition_name: '',
    start_date: `${Date.now()}`,
    start_time: `${Date.now()}`,
    end_date: `${Date.now()}`,
    end_time: `${Date.now()}`,
    points_per_yes: '0',
    points_per_no: '0',
    points_per_compilation_error: '0',
    points_per_minute: '0'
  })

  useEffect(() => {
    fetch(`${config.API_URL}/contest`)
      .then(res => res.json())
      .then(data => setSettings({
        ...data,
        start_date: toLocalDateString(data.start_date),
        start_time: toLocalTimeString(data.start_date),
        end_date: toLocalDateString(data.end_date),
        end_time: toLocalTimeString(data.end_date)
      }))
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSettings({ ...settings, [name]: value })
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.set('competition_name', settings.competition_name)
    formData.set('points_per_yes', settings.points_per_yes)
    formData.set('points_per_no', settings.points_per_no)
    formData.set('points_per_compilation_error', settings.points_per_compilation_error)
    formData.set('points_per_minute', settings.points_per_minute)
    formData.set('start_date', `${Date.parse(`${settings.start_date} ${settings.start_time}`) / 1000.0}`)
    formData.set('end_date', `${Date.parse(`${settings.end_date} ${settings.end_time}`) / 1000.0}`)

    await fetch(`${config.API_URL}/contest`, {
      method: 'PUT',
      body: formData
    })
  }

  return (
    <Block center size='xs-6'>
      <Form onSubmit={handleSubmit}>
        <h1>Settings</h1>
        <hr />

        <h3>Competition Settings</h3>

        <Form.Input
          label="Competition Name"
          type="text"
          required
          onChange={handleChange}
          value={settings.competition_name}
          name="competition_name"
        />

        <Form.Group widths='equal'>
          <Form.Field label='Start Date' control={Input} type='date' onChange={handleChange} name='start_date' value={settings.start_date} />
          <Form.Field label='Start Time' control={Input} type='time' onChange={handleChange} name='start_time' value={settings.start_time} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Field label='End Date' control={Input} type='date' onChange={handleChange} name='end_date' value={settings.end_date} />
          <Form.Field label='End Time' control={Input} type='time' onChange={handleChange} name='end_time' value={settings.end_time} />
        </Form.Group>

        <h3>Scoring System</h3>
        <Form.Field label='Points per Yes' control={Input} type='number' name='points_per_yes' value={settings.points_per_yes} onChange={handleChange} />
        <Form.Field label='Points per No' control={Input} type='number' name='points_per_no' value={settings.points_per_no} onChange={handleChange} />
        <Form.Field label='Points per Compilation Error' control={Input} type='number' name='points_per_compilation_error' value={settings.points_per_compilation_error} onChange={handleChange} />
        <Form.Field label='Points per Minute (1st Yes)' control={Input} type='number' name='points_per_yes' value={settings.points_per_minute} onChange={handleChange} />

        <Button primary>Save</Button>
      </Form>
    </Block>
  )
}

export default Settings