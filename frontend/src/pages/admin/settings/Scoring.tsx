import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import { SettingsProps } from '.'

const Scoring = ({ settings, handleChange }: SettingsProps): JSX.Element => <>
  <h3>Scoring System</h3>
  <Form.Field
    label="Points per Yes"
    control={Input}
    type="number"
    name="points_per_yes"
    value={settings.points_per_yes}
    onChange={handleChange}
  />
  <Form.Field
    label="Points per No"
    control={Input}
    type="number"
    name="points_per_no"
    value={settings.points_per_no}
    onChange={handleChange}
  />
  <Form.Field
    label="Points per Compilation Error"
    control={Input}
    type="number"
    name="points_per_compilation_error"
    value={settings.points_per_compilation_error}
    onChange={handleChange}
  />
  <Form.Field
    label="Points per Minute (1st Yes)"
    control={Input}
    type="number"
    name="points_per_yes"
    value={settings.points_per_minute}
    onChange={handleChange}
  /> </>

export default Scoring