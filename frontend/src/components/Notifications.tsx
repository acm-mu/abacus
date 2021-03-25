import React, { useContext, useEffect, useState } from 'react';
import { Message, MessageProps } from 'semantic-ui-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AppContext from 'AppContext';
import './Notifications.scss';

interface Notification {
  header?: string;
  content: string;
  id: string;
  visible: boolean;
  type: 'success' | 'warning' | 'error' | undefined
}

const Notifications = (): JSX.Element => {
  const { socket } = useContext(AppContext)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    socket?.on('notification', (notification: Notification) => {
      console.log(notification)
      notifications.push(notification)
      setNotifications(notifications)
    })
  }, [socket])

  const handleDismiss = (event: React.MouseEvent<HTMLElement, MouseEvent>, { id }: MessageProps) =>
    setNotifications(notifications.filter(({ id: nid }) => id != nid))

  console.log(notifications)

  return <TransitionGroup className='notifications'>
    {Object.values(notifications).map(({ header, content, id }) => (
      <CSSTransition key={`notification-${id}`} timeout={500} className='notification'>
        <Message
          id={id}
          icon='check'
          type='success'
          header={header || "Success!"}
          content={content}
          onDismiss={handleDismiss} />
      </CSSTransition>))}
  </TransitionGroup>
}

export default Notifications