import type { IClarification } from "abacus"
import { AppContext } from "context"
import React, { useContext } from "react"
import Moment from "react-moment"
import { Header, Icon, Menu, Popup } from "semantic-ui-react"
import { ClarificationContext } from "."

const ClarificationMenuItem = ({ clarification }: { clarification: IClarification }): React.JSX.Element => {
  const { user } = useContext(AppContext)
  const { activeItem, setActiveItem } = useContext(ClarificationContext)

  return <Menu.Item
    name={clarification.cid}
    onClick={(_, { name }) => name && setActiveItem(name)}
    key={clarification.cid}
    active={activeItem == clarification.cid}
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
}

export default ClarificationMenuItem