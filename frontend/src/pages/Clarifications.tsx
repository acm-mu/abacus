import { Clarification } from 'abacus'
import { Block, ClarificationModal, PageLoading, Unauthorized } from 'components'
import { ClarificationsList } from "components/clarification"
import { AppContext, ClarificationContext, SocketContext } from 'context'
import config from 'environment'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import './Clarifications.scss'

const Clarifications = (): React.JSX.Element => {
  usePageTitle("Abacus | Clarifications")
  const { cid } = useParams<{ cid: string }>()

  const { user } = useContext(AppContext)
  const socket = useContext(SocketContext)

  const [isLoading, setLoading] = useState(true)
  const [clarifications, setClarifications] = useState<Clarification[]>()
  const [selectedItem, setSelectedItem] = useState<string>(cid || '')

  const loadClarifications = async () => {
    let clarifications = {}

    try {
      const response = await fetch(`${config.API_URL}/clarifications`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.accessToken}` }
      })

      if (response.ok) {
        clarifications = await response.json()
        setClarifications(Object.values(clarifications))
      }
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadClarifications()
  }, [])

  useEffect(() => {
    socket?.on('new_clarification', () => loadClarifications())
  }, [socket])

  if (!user || user.role === 'proctor') return <Unauthorized />

  if (isLoading) return <PageLoading />

  return <Block size="xs-12" transparent>
    <h2>Clarifications</h2>
    <ClarificationModal
      trigger={<Button content="Ask Clarification" />}
      callback={({ cid }) => {
        loadClarifications()
        setSelectedItem(cid)
      }}
    />
    <ClarificationContext.Provider value={{
      clarifications,
      selectedItem,
      onSelectedItemChanged: (cid: string) => setSelectedItem(cid),
      reloadClarifications: loadClarifications
    }}>
      <ClarificationsList />
    </ClarificationContext.Provider>
  </Block>
}

export default Clarifications
