import React, { ChangeEvent, useContext, useEffect, useState, FC} from 'react'
import { Button, Grid, Label, Pagination, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import DivisionLabel from 'components/DivisionLabel';
interface CustomTableProps {
header: any;
body: any;
id: string;
sort: any
onClickHeaderItem: (item: string) => void
onCheckAll: any
onCheckItem: (item: any) => void
}

/*
body -> 
*/


const CustomTable: FC<CustomTableProps> = ({header, body,id,sort, onClickHeaderItem, onCheckAll, onCheckItem}): JSX.Element => {
  const bodyProp = Object.keys(body)
  console.log('body', body)
  console.log('header', header)
  const renderRow = (cellid: any, property: any,items: any) => {
    console.log('prop', property)
    if(property === 'division') {
      return <Table.Cell ><DivisionLabel division={items[property]} />   </Table.Cell>
    }
    else if(property === 'username') {
      return (
    <Table.Cell>
    <Link to={`/admin/users/${cellid}`}>{items[property]}</Link>
  </Table.Cell>
      )
 }
 return ( <Table.Cell>
   {items[property]}
</Table.Cell>)
  }
    return (
        <Table sortable>
        <Table.Header>
        <Table.Row>
        <Table.HeaderCell collapsing>
          <input type="checkbox" onChange={onCheckAll} />
          </Table.HeaderCell>
          {header.map((item: any) => (<Table.HeaderCell
              sorted={sort.column === item ? sort.direction : undefined}
              onClick={() => onClickHeaderItem(item) }
              content={(item[0].toUpperCase() + item.slice(1)).replace('_',' ')}
            />))
          }
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {/* basing this off of the users table, every header value is a property, we go off the header values so that the cells are in order */}
        {body && body.map((bodyItem: any) => { 
          console.log("item", bodyItem)
          return (
            <Table.Row key={bodyItem[`${id}`]} uuid={bodyItem[`${id}`]}>
               <Table.Cell>
                <input type="checkbox" checked={bodyItem['checked']} id={bodyItem[`${id}`]} onChange={(item) => onCheckItem(item)} />
              </Table.Cell>
              {bodyItem && header.filter((a: string) => a !== 'checked' && a !== id).map((item: any, i: any) => {
                return (
              renderRow(bodyItem[id],item,bodyItem)
                )
              })}
            </Table.Row>
          )
        })}
        </Table.Body>
      </Table>
    );
  }
  
  export default CustomTable;