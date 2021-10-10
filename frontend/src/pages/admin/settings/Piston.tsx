import React, { useEffect, useState } from 'react'
import config from 'environment'
import { PageLoading } from 'components'
import { Button, Dropdown, DropdownProps, Table } from 'semantic-ui-react'

type Language = {
  name: string
  version: string
  status: string
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

    setLanguages(
      data.map((e: Record<string, string | boolean>) => ({
        name: e.language,
        version: e.language_version,
        status: e.installed ? 'installed' : 'not-installed'
      }))
    )

    setLoading(false)
  }

  useEffect(() => {
    loadLanguages()
    return () => setMounted(false)
  }, [])

  const handleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setToInstall(data.value as string)
  }

  const installPackage = async () => {
    const language = toInstall?.split('-')
    if (!language) return

    console.log(`Submitting request to install ${language[0]} (version ${language[1]})`)

    await fetch(`${config.PISTON_URL}/api/v2/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: language[0],
        version: language[1]
      })
    })
  }

  const uninstallPackage = async (name: string, version: string) => {
    console.log(`Submitting request to uninstall ${name} (version ${version})`)

    await fetch(`${config.PISTON_URL}/api/v2/packages`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: name,
        version: version
      })
    })
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <h3>Available Languages</h3>
      <Dropdown
        placeholder="Language"
        search
        selection
        onChange={handleChange}
        options={languages
          .filter(({ status }) => status === 'not-installed')
          .map(({ name, version }, index) => ({
            key: `not-installed-${index}`,
            value: `${name}-${version}`,
            text: `${name} (${version})`
          }))}
      />
      <Button primary disabled={toInstall == undefined} onClick={installPackage}>
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
          {languages
            .filter(({ status }) => status === 'installed')
            .map(({ name, version }, index) => (
              <Table.Row key={`installed-${index}`}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{version}</Table.Cell>
                <Table.Cell>
                  <Button loading={true} size="mini" onClick={() => uninstallPackage(name, version)}>
                    Uninstall
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default Piston
