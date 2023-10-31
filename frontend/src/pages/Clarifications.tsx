import type { IClarification } from 'abacus'
import { ClarificationRepository } from 'api'
import { Block, PageLoading, Unauthorized } from 'components'
import { ClarificationModal, ClarificationsMenu, ClarificationView } from "components/clarification"
import { AppContext, SocketContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Grid, Segment } from 'semantic-ui-react'
import './Clarifications.scss'

const Clarifications = (): React.JSX.Element => {
  usePageTitle("Abacus | Clarifications")

  const clarificationRepository = new ClarificationRepository()

  const { user } = useContext(AppContext)
  const socket = useContext(SocketContext)

  const { cid } = useParams<{ cid: string }>()

  const [isLoading, setLoading] = useState(true)
  const [clarifications, setClarifications] = useState<IClarification[]>()
  const [activeItem, setActiveItem] = useState<string>(cid || '')

  const loadClarifications = async () => {
    const response = await clarificationRepository.getMany()
    if (response.ok && response.data) {
      setClarifications(Object.values(response.data))
    }

    setLoading(false)
  }

  useEffect(() => {
    loadClarifications()
      .catch(console.error)
  }, [])

  useEffect(() => {
    socket?.on('new_clarification', () => loadClarifications())
  }, [socket])

  if (!user || user.role === 'proctor') return <Unauthorized />

  if (isLoading) return <PageLoading />

  const activeClarification = clarifications?.find(c => c.cid == activeItem)

  return <Block size="xs-12" transparent>
    <h2>Clarifications</h2>
    <ClarificationModal
      trigger={<Button content="Ask Clarification" />}
      callback={({ cid }) => {
        loadClarifications()
        setActiveItem(cid)
      }}
    />
    {!clarifications?.length ?
      <>
        <p>There are no active clarifications right now!</p>
      </> :
      <Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={4}>
              <ClarificationsMenu clarifications={clarifications} />
            </Grid.Column>
            <Grid.Column width={12}>
              <ClarificationView clarification={activeClarification} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    }
  </Block>
}

export default Clarifications
