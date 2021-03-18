import { Clarification } from 'abacus';
import React, { useEffect, useState } from 'react';
import { Loader, Menu } from 'semantic-ui-react';
import config from 'environment'

const Clarifications = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true)
  const [clarifications, setClarifications] = useState<Clarification[]>([])
  const [activeItem] = useState('')

  const loadClarifications = async () => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })
    if (response.ok)
      setClarifications(Object.values(await response.json()))

    setLoading(false)
  }

  useEffect(() => {
    loadClarifications()
  }, [])

  const handleClick = () => { return }

  if (isLoading) return <Loader active inline='centered' />

  return <Menu secondary vertical>
    {clarifications.length > 0 && clarifications.map((clarification: Clarification) =>
      <Menu.Item
        key={clarification.cid}
        name={clarification.title}
        active={activeItem == clarification.cid}
        onClick={handleClick} />
    )}
  </Menu>
}

export default Clarifications