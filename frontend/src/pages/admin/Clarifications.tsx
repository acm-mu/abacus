import type { IClarification, SortConfig } from 'abacus'
import { ClarificationRepository } from 'api'
import { Block, DivisionLabel, PageLoading } from 'components'
import { ClarificationModal } from "components/clarification"
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Button, Checkbox, CheckboxProps, Label, Table } from 'semantic-ui-react'


interface ClarificationItem extends IClarification {
  checked: boolean
}

const Clarifications = (): React.JSX.Element => {
  usePageTitle("Abacus | Admin Clarifications")

  const clarificationRepo = new ClarificationRepository()

  const [isLoading, setLoading] = useState(true)
  const [isDeleting, setDeleting] = useState(false)
  const [clarifications, setClarifications] = useState<ClarificationItem[]>()
  const [showClosed, setShowClosed] = useState(false)
  const [{ sortBy, sortDirection }, setSortConfig] = useState<SortConfig<IClarification>>({
    sortBy: 'date',
    sortDirection: 'ascending'
  })

  const onFilterChange = (_event: React.FormEvent<HTMLInputElement>, { checked }: CheckboxProps) =>
    setShowClosed(checked || false)
  /*
  @param page - page to query when paginating
  updates the new page of clarifications
  */

  const sort = (newColumn: keyof IClarification) => {
    setSortConfig({
      sortBy: newColumn,
      sortDirection: sortBy === newColumn && sortDirection == 'ascending' ? 'descending' : 'ascending'
    })
  }

  useEffect(() => {
    loadClarifications().catch(console.error)
  }, [sortBy, sortDirection])

  const loadClarifications = async () => {
    //include page as query, so that API can fetch it.
    const response = await clarificationRepo.getMany({ sortBy, sortDirection })

    if (response.ok && response.data) {
      setClarifications(Object.values(response.data.items).map((clarification) => ({ ...clarification, checked: false })))
    }

    setLoading(false)
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setClarifications(
      clarifications?.map((clarification) => (clarification.cid == id ? { ...clarification, checked } : clarification))
    )

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setClarifications(clarifications?.map((clarification) => ({ ...clarification, checked })))

  const deleteSelected = async () => {
    setDeleting(true)
    const clarificationsToDelete = clarifications?.filter((clarification) => clarification.checked).map((clarification) => clarification.cid)

    if (clarificationsToDelete) {
      await clarificationRepo.delete(clarificationsToDelete)
    }

    setDeleting(false)
    await loadClarifications()
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <ClarificationModal trigger={<Button content="Create Clarification" />} />
      {clarifications?.filter((clarification) => clarification.checked).length ? (
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
                sorted={sortBy == 'cid' ? sortDirection : undefined}>
                Clarification ID
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('type')}
                sorted={sortBy == 'type' ? sortDirection : undefined}>
                Type
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('division')}
                sorted={sortBy == 'division' ? sortDirection : undefined}>
                Division
              </Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('title')}
                sorted={sortBy == 'title' ? sortDirection : undefined}>
                Title
              </Table.HeaderCell>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Replies</Table.HeaderCell>
              <Table.HeaderCell
                className="sortable"
                onClick={() => sort('date')}
                sorted={sortBy == 'date' ? sortDirection : undefined}>
                Date
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!clarifications?.length ? (
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
                      <Link to={`/admin/clarifications/${clarification.cid}`}>{clarification.children?.length}</Link>
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
