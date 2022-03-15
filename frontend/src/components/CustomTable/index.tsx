import React, {ChangeEvent, FC} from 'react'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import DivisionLabel from 'components/DivisionLabel';
import { User } from 'abacus';

type SortKey = 'uid' | 'display_name' | 'username' | 'role' | 'division' | 'school'
type SortConfig = {
  column: SortKey
  direction: 'ascending' | 'descending'
}

interface UserItem extends User {
  checked: boolean
}

interface CustomTableProps {
header: string[];
body: UserItem[];
id: string;
sort: SortConfig;
onClickHeaderItem: (item: string) => void;
onCheckAll: (item: ChangeEvent<HTMLInputElement>) => void
onCheckItem: (item: ChangeEvent<HTMLInputElement>) => void
}

/*
body -> 
*/


const CustomTable: FC<CustomTableProps> = ({header, body,id,sort, onClickHeaderItem, onCheckAll, onCheckItem}): JSX.Element => {
  const renderRow = (cellid: string, property: string,items: any) => {
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
          {header.map((item: string, i: number) => (<Table.HeaderCell
              key={i}
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
              {bodyItem && header.filter((a: string) => a !== 'checked' && a !== id).map((item: string) => {
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