import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import { SettingsProps } from '.'

const Schedule = ({ settings, handleChange }: SettingsProps): JSX.Element => (
  <>
    <h3>Practice Period</h3>

    <Form.Group widths="equal">
      <Form.Field
        label="Start Date"
        control={Input}
        type="date"
        onChange={handleChange}
        name="practice_start_date"
        value={settings.practice_start_date}
      />
      <Form.Field
        label="Start Time"
        control={Input}
        type="time"
        onChange={handleChange}
        name="practice_start_time"
        value={settings.practice_start_time}
      />
    </Form.Group>

    <Form.Group widths="equal">
      <Form.Field
        label="End Date"
        control={Input}
        type="date"
        onChange={handleChange}
        name="practice_end_date"
        value={settings.practice_end_date}
      />
      <Form.Field
        label="End Time"
        control={Input}
        type="time"
        onChange={handleChange}
        name="practice_end_time"
        value={settings.practice_end_time}
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
        value={settings.start_date}
      />
      <Form.Field
        label="Start Time"
        control={Input}
        type="time"
        onChange={handleChange}
        name="start_time"
        value={settings.start_time}
      />
    </Form.Group>

    <Form.Group widths="equal">
      <Form.Field
        label="End Date"
        control={Input}
        type="date"
        onChange={handleChange}
        name="end_date"
        value={settings.end_date}
      />
      <Form.Field
        label="End Time"
        control={Input}
        type="time"
        onChange={handleChange}
        name="end_time"
        value={settings.end_time}
      />
    </Form.Group>
  </>
)

export default Schedule
