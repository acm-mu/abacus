import React from 'react'
import { Form } from 'semantic-ui-react'
import { SettingsProps } from '.'

const General = ({ settings, handleChange }: SettingsProps): JSX.Element =>
  <>
    <h3>Competition Settings</h3>

    <Form.Input
      label="Competition Display Name"
      type="text"
      required
      onChange={handleChange}
      value={settings.competition_name}
      name="competition_name"
    />

    <Form.Input
      label="Practice Display Name"
      type="text"
      required
      onChange={handleChange}
      value={settings.practice_name}
      name="practice_name"
    />
  </>

export default General