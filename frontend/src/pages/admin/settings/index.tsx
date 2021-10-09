import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { Button, Divider, Form, Menu, MenuItemProps } from 'semantic-ui-react'
import { Block, PageLoading, StatusMessage } from 'components'
import config from 'environment'
import { Helmet } from 'react-helmet'
import { StatusMessageType } from 'components/StatusMessage'
import { useHistory } from 'react-router'
import { toLocalDateString, toLocalTimeString } from 'utils'
import General from './General'
import Schedule from './Schedule'
import Scoring from './Scoring'
import Piston from './Piston'

export type SettingsProps = {
  settings: { [key: string]: string }
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Settings = (): JSX.Element => {
  const history = useHistory()
  const [settings, setSettings] = useState<{ [key: string]: string }>({
    competition_name: '',
    practice_name: '',
    start_date: `${Date.now()}`,
    start_time: `${Date.now()}`,
    end_date: `${Date.now()}`,
    end_time: `${Date.now()}`,
    practice_start_date: `${Date.now()}`,
    practice_start_time: `${Date.now()}`,
    practice_end_date: `${Date.now()}`,
    practice_end_time: `${Date.now()}`,
    points_per_yes: '0',
    points_per_no: '0',
    points_per_compilation_error: '0',
    points_per_minute: '0'
  })
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState<StatusMessageType>()

  useEffect(() => {
    loadSettings()
    return () => {
      setMounted(false)
    }
  }, [])

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
    setSettings({ ...settings, [name]: value })

  const loadSettings = async () => {
    const response = await fetch(`${config.API_URL}/contest`)
    const data = await response.json()
    if (!isMounted) return

    setSettings({
      ...data,
      start_date: toLocalDateString(data.start_date),
      start_time: toLocalTimeString(data.start_date),
      end_date: toLocalDateString(data.end_date),
      end_time: toLocalTimeString(data.end_date),

      practice_start_date: toLocalDateString(data.practice_start_date),
      practice_start_time: toLocalTimeString(data.practice_start_date),
      practice_end_date: toLocalDateString(data.practice_end_date),
      practice_end_time: toLocalTimeString(data.practice_end_date)
    })

    setLoading(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    const formData = new FormData()
    formData.set('competition_name', settings.competition_name)
    formData.set('practice_name', settings.practice_name)
    formData.set('points_per_yes', settings.points_per_yes)
    formData.set('points_per_no', settings.points_per_no)
    formData.set('points_per_compilation_error', settings.points_per_compilation_error)
    formData.set('points_per_minute', settings.points_per_minute)
    formData.set('start_date', `${Date.parse(`${settings.start_date} ${settings.start_time}`) / 1000.0}`)
    formData.set('end_date', `${Date.parse(`${settings.end_date} ${settings.end_time}`) / 1000.0}`)
    formData.set(
      'practice_start_date',
      `${Date.parse(`${settings.practice_start_date} ${settings.practice_start_time}`) / 1000.0}`
    )
    formData.set(
      'practice_end_date',
      `${Date.parse(`${settings.practice_end_date} ${settings.practice_end_time}`) / 1000.0}`
    )

    const response = await fetch(`${config.API_URL}/contest`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: formData
    })

    if (response.ok) {
      setMessage({ type: 'success', message: 'Settings saved successfully!' })
    } else {
      const body = await response.json()
      setMessage({ type: 'error', message: body.message })
    }
    setSaving(false)
  }
  const [activeItem, setActiveItem] = useState('general')
  const handleItemClick = (_event: MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)

  if (isLoading) return <PageLoading />

  return (
    <>
      <Helmet>
        <title>Abacus | Admin Settings</title>
      </Helmet>
      <h1>Settings</h1>
      <Menu attached="top" tabular>
        <Menu.Item name="General" tab="general" active={activeItem == 'general'} onClick={handleItemClick} />
        <Menu.Item name="Schedule" tab="schedule" active={activeItem == 'schedule'} onClick={handleItemClick} />
        <Menu.Item name="Scoring" tab="scoring" active={activeItem == 'scoring'} onClick={handleItemClick} />
        <Menu.Item name="Piston" tab="piston" active={activeItem == 'piston'} onClick={handleItemClick} />
      </Menu>
      <Block center size="xs-12" menuAttached="top">
        <StatusMessage message={message} onDismiss={() => setMessage(undefined)} />
        <Form>
          {(() => {
            switch (activeItem) {
              case 'general':
                return <General settings={settings} handleChange={handleChange} />
              case 'schedule':
                return <Schedule settings={settings} handleChange={handleChange} />
              case 'scoring':
                return <Scoring settings={settings} handleChange={handleChange} />
              case 'piston':
                return <Piston />
            }
          })()}

          <Divider />
          <Button floated="right" onClick={history.goBack}>
            Cancel
          </Button>

          <Button floated="right" primary onClick={handleSubmit} loading={isSaving} disabled={isSaving}>
            Save
          </Button>
        </Form>
      </Block>
    </>
  )
}

export default Settings
