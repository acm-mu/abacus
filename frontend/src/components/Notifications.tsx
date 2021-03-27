import { Notification } from 'abacus';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Message } from 'semantic-ui-react';
import io from 'socket.io-client';
import config from '../environment';
import { v4 as uuidv4 } from 'uuid';
import './Notifications.scss';

declare global {
  interface Window {
    notifications: Notification[]
    sendNotification: (notification: Notification) => void;
  }
}

const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>(window.notifications || [])

  window.sendNotification = (notification: Notification) => {
    if (!notification.id) notification.id = uuidv4()
    setNotifications(notifications =>
      notifications.concat(notification))
  }

  useEffect(() => {
    const socket = io(config.API_URL)
    socket.on('notification', window.sendNotification)
  }, [])

  const typeIcon = (type?: string) => {
    switch (type) {
      case 'success': return 'check'
      case 'warning': return 'warning sign'
      case 'error': return 'exclamation'
      default: return 'bell'
    }
  }

  return <TransitionGroup className='notifications'>
    {notifications.map(({ id, type, header, content }) =>
      <CSSTransition
        unmountOnExit
        key={id}
        timeout={500}
        className='notification'
      >
        <Message
          icon={typeIcon(type)}
          success={type === 'success'}
          warning={type === 'warning'}
          error={type === 'error'}
          header={header}
          content={content}
          onDismiss={() => setNotifications(notifications =>
            notifications.filter(notification => id != notification.id))}
        />
      </CSSTransition>
    )}
  </TransitionGroup>
}

export default Notifications