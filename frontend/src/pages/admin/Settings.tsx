import React, { useState, useEffect } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import { Block } from '../../components'

const Settings = (): JSX.Element => {
  const [settings, setSettings] = useState({
    competition_name: '',
    start_date: '',
    end_date: '',
    points_per_yes: 0,
    points_per_no: 0,
    points_per_compilation_error: 0,
    points_per_minute: 0,
  })

  useEffect(() => {
    fetch('http://api.codeabac.us/v1/contest')
      .then(res => res.json())
      .then(data => setSettings(data))
  }, [])

  return (
    <Block size='xs-6'>
      <Form>
        <h1>Settings</h1>
        <hr />

        <h3>Competition Settings</h3>
        <Form.Field label='Competition Name' control={Input} value={settings.competition_name} />

        <label>Start Date</label>
        <Form.Group widths='equal' date={settings.start_date}>
          <Form.Field control={Input} type='date' />
          <Form.Field control={Input} type='time' />
        </Form.Group>

        <label>End Date</label>
        <Form.Group widths='equal' date={settings.end_date}>
          <Form.Field control={Input} type='date' />
          <Form.Field control={Input} type='time' />
        </Form.Group>

        <h3>Scoring System</h3>
        <Form.Field label='Points per Yes' control={Input} type='number' value={settings.points_per_yes} />
        <Form.Field label='Points per No' control={Input} type='number' value={settings.points_per_no} />
        <Form.Field label='Points per Compilation Error' control={Input} type='number' value={settings.points_per_compilation_error} />
        <Form.Field label='Points per Minute (1st Yes)' control={Input} type='number' value={settings.points_per_minute} />

        <Button color='blue'>Save</Button>
      </Form>
    </Block>
  )
}

export default Settings