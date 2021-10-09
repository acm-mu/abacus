import React, { useEffect, useState } from 'react'
import config from 'environment'
import { PageLoading } from 'components'
import { Button, Dropdown, DropdownProps, Table } from 'semantic-ui-react'

type Language = {
  language: string
  language_version: string
  installed: boolean
}


const Piston = (): JSX.Element => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)

  const [toInstall, setToInstall] = useState<string>()

  const loadLanguages = async () => {
    const response = await fetch(`${config.PISTON_URL}/api/v2/packages`)
    const data = await response.json()
    if (!isMounted) return

    setLanguages(data)
    setLoading(false)
  }

  useEffect(() => {
    loadLanguages()
    return () => setMounted(false)
  }, [])

  const handleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setToInstall(data.value as string)
  }

  const submitInstall = async () => {
    const language = toInstall?.split('-')
    if (!language) return

    console.log(`Submitting request to install ${language[0]} (version ${language[1]})`)

    const res = await fetch(`${config.PISTON_URL}/api/v2/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: language[0],
        version: language[1]
      })
    })
  }

  if (isLoading) return <PageLoading />

  return <>
    <h3>Available Languages</h3>
    <Dropdown placeholder='Language'
      search
      selection
      onChange={handleChange}
      options={languages.filter(p => !p.installed).map((p, index) => (({
        key: `not-installed-${index}`,
        value: `${p.language}-${p.language_version}`,
        text: `${p.language} (${p.language_version})`
      })))} />
    <Button primary
      disabled={toInstall == undefined}
      onClick={submitInstall}>
      Install
    </Button>

    <h3>Installed Languages</h3>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Language</Table.HeaderCell>
          <Table.HeaderCell>Language Version</Table.HeaderCell>
          <Table.HeaderCell>Action(s)</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {languages.filter(p => p.installed).map((p, index) =>
          <Table.Row key={`installed-${index}`}>
            <Table.Cell>{p.language}</Table.Cell>
            <Table.Cell>{p.language_version}</Table.Cell>
            <Table.Cell><Button size='mini'>Uninstall</Button></Table.Cell>
          </Table.Row>
        )}
      </Table.Body>

    </Table>
  </>
}

export default Piston