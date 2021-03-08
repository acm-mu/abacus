import React, { useContext, useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import AppContext from '../AppContext';
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
  const [notifications, setNotifications] = useState<{ [key: string]: Notification }>({})

  useEffect(() => {
    socket?.on('notification', (notification: Notification) => {
      setTimeout(() => {
        setNotifications({ ...notifications, [notification.id]: { ...notification, visible: true } })
      }, 200)
      setNotifications({ ...notifications, [notification.id]: notification })
    })
  }, [socket])

  const handleDismiss = () => {
    return
  }

  return <div className='notifications'>
    {Object.values(notifications).map(({ header, content, id, visible, type }: Notification) => {
      switch (type) {
        case 'success':
          return <Message
            key={`notification-${id}`}
            className={visible ? 'visible' : ''}
            icon='check'
            header={header || "Success!"}
            content={content}
            onDismiss={handleDismiss} />
        case 'error':
          return <Message
            key={`notification-${id}`}
            className={visible ? 'visible' : ''}
            icon='exclamation circle'
            header={header || "Error!"}
            content={content}
            onDismiss={handleDismiss} />
        case 'warning':
          return <Message
            key={`notification-${id}`}
            className={visible ? 'visible' : ''}
            icon='exclamation triangle'
            header={header || "Warning"}
            content={content}
            onDismiss={handleDismiss} />
        default:
          return <Message
            key={`notification-${id}`}
            className={visible ? 'visible' : ''}
            header={header}
            content={content}
            onDismiss={handleDismiss} />
      }
    })}
  </div>
}

export default Notifications