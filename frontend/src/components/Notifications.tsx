import { Notification } from 'abacus';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Message } from 'semantic-ui-react';
import io from 'socket.io-client';
import config from '../environment';
import './Notifications.scss';

const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const socket = io(config.API_URL)

    socket.on('notification', (notification: Notification) => {
      setNotifications(notifications =>
        notifications.concat(notification))
    })
  }, [])

  const typeIcon = (type?: string) => {
    switch (type) {
      case 'success': return 'check'
      case 'warning': return 'warning triangle'
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