import type { SortConfig } from "abacus"
import { DivisionLabel } from 'components'
import React, { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Pagination, PaginationProps, Table } from 'semantic-ui-react'

interface CustomTableProps<T extends Record<string, unknown>> {
  header: (keyof T)[]
  body: T[] | undefined
  totalPages: number
  id: keyof T
  sort: SortConfig<T>
  onClickHeaderItem: (item: keyof T) => void
  onCheckAll: (item: ChangeEvent<HTMLInputElement>) => void
  onCheckItem: (item: ChangeEvent<HTMLInputElement>) => void
  onPageChange: (data: PaginationProps) => void
}

/*
body -> 
*/

const CustomTable = <T extends Record<string, unknown>, >({
  header,
  body,
  totalPages,
  id,
  sort,
  onClickHeaderItem,
  onCheckAll,
  onCheckItem,
  onPageChange
}: CustomTableProps<T>): React.JSX.Element => {

  type HeaderType = keyof T
  const renderRow = (cellid: T[keyof T], property: HeaderType, items: T) => {
    if (property === 'division') {
      return (
        <Table.Cell>
          <DivisionLabel division={items[property] as string} />{' '}
        </Table.Cell>
      )
    } else if (property === 'username') {
      return (
        <Table.Cell>
          <Link to={`/admin/users/${cellid}`}>{`${items[property]}`}</Link>
        </Table.Cell>
      )
    }
    return <Table.Cell>{`${items[property] ?? ''}`}</Table.Cell>
  }
  return <>
    <Table sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing>
            <input type="checkbox" onChange={onCheckAll} />
          </Table.HeaderCell>
          {header.map((item, i) => {
            let headerName = item as string
            headerName = headerName[0].toUpperCase() + headerName.slice(1)

            return <Table.HeaderCell
              key={i}
              sorted={sort.sortBy === item ? sort.sortDirection : undefined}
              onClick={() => onClickHeaderItem(item)}
              content={headerName.replace('_', ' ')}
            />
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {/* basing this off of the users table, every header value is a property, we go off the header values so that the cells are in order */}
        {body &&
          body.map((bodyItem) => {
            return (
              <Table.Row key={`${bodyItem[id]}`} uuid={bodyItem[id]}>
                <Table.Cell>
                  {'checked' in bodyItem ?
                    <input
                      type="checkbox"
                      checked={bodyItem['checked'] as boolean}
                      id={`${bodyItem[id]}`}
                      onChange={(item) => onCheckItem(item)}
                    /> : <>a</>}
                </Table.Cell>
                {bodyItem &&
                  header
                    .filter((a: HeaderType) => a !== 'checked' && a !== id)
                    .map((item: HeaderType) => {
                      return renderRow(bodyItem[id], item, bodyItem)
                    })}
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table>
    <Pagination defaultActivePage={1} totalPages={totalPages} onPageChange={(_e, data) => onPageChange(data)}/>
  </>
}

export default CustomTable
