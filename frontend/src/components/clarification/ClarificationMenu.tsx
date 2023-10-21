import { Clarification } from "abacus"
import { AppContext, ClarificationContext } from 'context'
import React, { FormEvent, useContext, useState } from "react"
import Moment from "react-moment"
import { Checkbox, CheckboxProps, Header, Icon, Menu, Popup } from "semantic-ui-react"

const ClarificationsMenu = () => {
  const { clarifications, selectedItem, onSelectedItemChanged } = useContext(ClarificationContext)
  const { user } = useContext(AppContext)
  const [showClosed, setShowClosed] = useState(false)

  const onFilterChange = (_event: FormEvent<HTMLInputElement>, { checked }: CheckboxProps) =>
    setShowClosed(checked || false)

  return <>
    <Checkbox toggle label="Show Closed" checked={showClosed} onChange={onFilterChange} />
    <Menu secondary vertical style={{ width: '100%' }}>
      {clarifications?.filter((c1) => showClosed || c1.open)
        .sort((c1, c2) => c2.date - c1.date)
        .map((clarification: Clarification) => (
          <Menu.Item
            name={clarification.cid}
            onClick={() => onSelectedItemChanged(clarification.cid)}
            key={clarification.cid}
            active={selectedItem == clarification.cid}
            className={`${clarification.open ? 'open' : 'closed'}`}>
            <Header as="h5">
              {clarification.title}
              {clarification.open ? (
                clarification.type == 'private' ? (
                  <Popup content="Private" trigger={<Icon name="eye slash" />} />
                ) : (
                  <Popup content="Public" trigger={<Icon name="eye" />} />
                )
              ) : (
                <Icon name="lock" />
              )}
            </Header>
            {user?.uid == clarification.user.uid ? 'You' : clarification.user.display_name}
            <Moment fromNow date={clarification.date * 1000} />
          </Menu.Item>
        ))}
    </Menu>
  </>
}
export default ClarificationsMenu