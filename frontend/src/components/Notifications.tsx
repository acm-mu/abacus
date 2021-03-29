import { Context, Notification } from 'abacus';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Message } from 'semantic-ui-react';
import io from 'socket.io-client';
import config from '../environment';
import { v4 as uuidv4 } from 'uuid';
import './Notifications.scss';
import { Link } from 'react-router-dom';
import AppContext from 'AppContext';
import { userHome } from 'utils';

declare global {
  interface Window {
    notifications: Notification[]
    sendNotification: (notification: Notification) => void;
  }
}

const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>(window.notifications || [])
  const { user } = useContext(AppContext)

  window.sendNotification = (notification: Notification) => {
    if (!notification.id) notification.id = uuidv4()
    setNotifications(notifications =>
      notifications.concat(notification))

    setTimeout(() => {
      setNotifications(notifications =>
        notifications.filter(({ id }) => id != notification.id))
    }, 15 * 1000)

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

  const contextLink = (context?: Context): string => {
    if (!context || !user) return ''
    switch (context.type) {
      case 'cid': return `${userHome(user)}/clarifications/${context.id}`
      case 'pid': return `${userHome(user)}/problems/${context.id}`
      case 'sid': return `${userHome(user)}/submissions/${context.id}`
    }
  }

  return <TransitionGroup className='notifications'>
    {notifications.map(({ id, type, header, content, context }) =>
      <CSSTransition
        unmountOnExit
        key={id}
        timeout={500}
        className='notification'
      >
        <Message
          as={Link}
          to={contextLink(context)}
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