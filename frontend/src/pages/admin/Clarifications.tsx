import { Clarification } from 'abacus'
import { Block, ClarificationModal, DivisionLabel, PageLoading } from 'components'
import config from 'environment'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Button, Checkbox, CheckboxProps, Label, Table } from 'semantic-ui-react'
import { compare } from 'utils'

interface ClarificationItem extends Clarification {
  checked: boolean
}

type SortKey = 'title' | 'date' | 'cid' | 'type' | 'division'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

const Clarifications = (): React.JSX.Element => {
  const [isLoading, setLoading] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [clarifications, setClarifications] = useState<ClarificationItem[]>([])
  const [showClosed, setShowClosed] = useState(false)
  const [{ column, direction }, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'ascending'
  })

  const onFilterChange = (event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) =>
    setShowClosed(checked || false)
  /*
  @param page - page to query when paginating
  updates the new page of clarifications
  */

  const loadClarifications = async () => {
    //include page as query, so that API can fetch it.
    const response = await fetch(`${config.API_URL}/clarifications`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })
    if (response.ok) {
      const newClarifications = Object.values(await response.json()) as ClarificationItem[]
      setClarifications(
        newClarifications
          .map((clarification) => ({ ...clarification, checked: false }))
          .sort((c1, c2) => c2.date - c1.date)
      )
    } else {
      setClarifications([])
    }

    setLoading(false)
  }

  const sort = (newColumn: SortKey, clarification_list: ClarificationItem[] = clarifications) => {
    const newDirection = column === newColumn && direction == 'ascending' ? 'descending' : 'ascending'
    setSortConfig({ column: newColumn, direction: newDirection })
    setClarifications(
      clarification_list.sort(
        (c1: Clarification, c2: Clarification) =>
          compare(c1[newColumn] || 'ZZ', c2[newColumn] || 'ZZ') * (direction == 'ascending' ? 1 : -1)
      )
    )
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setClarifications(
      clarifications.map((clarification) => (clarification.cid == id ? { ...clarification, checked } : clarification))
    )

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setClarifications(clarifications.map((clarification) => ({ ...clarification, checked })))

  const deleteSelected = async () => {
    setDeleting(true)
    const clarificationsToDelete = clarifications
      .filter((clarification) => clarification.checked)
      .map((clarification) => clarification.cid)
    await fetch(`${config.API_URL}/clarifications`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      body: JSON.stringify({ cid: clarificationsToDelete })
    })
    setDeleting(false)
    loadClarifications()
  }

  useEffect(() => {
    document.title = "Abacus | Admin Clarifications"
    loadClarifications()
  }, [])

  if (isLoading) return <PageLoading />

  return (
    <>
      <ClarificationModal trigger={<Button content="Create Clarification" />} />
      {clarifications.filter((clarification) => clarification.checked).length ? (
        <Button
          content="Delete Selected"
          negative
          onClick={deleteSelected}
          loading={isDeleting}
          disabled={isDeleting}
        />
      ) : (
        <></>
      )}

      <Block transparent size="xs-12">
        <Checkbox toggle label="Show Closed" checked={showClosed} onChange={onFilterChange} />
        <Table sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <input type="checkbox" onChange={checkAll} />
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('cid')}
                sorted={column == 'cid' ? direction : undefined}>
                Clarification ID
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('type')}
                sorted={column == 'type' ? direction : undefined}>
                Type
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('division')}
                sorted={column == 'division' ? direction : undefined}>
                Division
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('title')}
                sorted={column == 'title' ? direction : undefined}>
                Title
              </Table.HeaderCell>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Replies</Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('date')}
                sorted={column == 'date' ? direction : undefined}>
                Date
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {clarifications.length == 0 ? (
              <Table.Row>
                <Table.Cell colSpan={'100%'}>No Clarifications</Table.Cell>
              </Table.Row>
            ) : (
              clarifications
                .filter((clarification) => showClosed || clarification.open)
                .map((clarification) => (
                  <Table.Row key={clarification.cid}>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        checked={clarification.checked}
                        id={clarification.cid}
                        onChange={handleChange}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/admin/clarifications/${clarification.cid}`}>{clarification.cid.substring(0, 7)}</Link>
                      {!clarification.open ? <Label color="red" style={{ float: 'right' }} content="Closed" /> : <></>}
                    </Table.Cell>
                    <Table.Cell>{clarification.type}</Table.Cell>
                    <Table.Cell>
                      <DivisionLabel division={clarification.division} />
                    </Table.Cell>
                    <Table.Cell>{clarification.title}</Table.Cell>
                    <Table.Cell>{clarification.user?.display_name}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/admin/clarifications/${clarification.cid}`}>{clarification.children.length}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Moment date={clarification.date * 1000} fromNow />
                    </Table.Cell>
                  </Table.Row>
                ))
            )}
          </Table.Body>
        </Table>
      </Block>
    </>
  )
}

export default Clarifications
