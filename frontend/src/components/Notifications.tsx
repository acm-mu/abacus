import { Notification } from 'abacus';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Message } from 'semantic-ui-react';
import './Notifications.scss';

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>
}



const Notifications = ({ notifications, setNotifications }: NotificationsProps): JSX.Element => {

  const typeIcon = (type?: string) => {
    switch (type) {
      case 'success': return 'check'
      case 'warning': return 'warning triangle'
      case 'error': return 'exclamation'
      default: return 'bell'
    }
  }

  const NotificationMessage = ({ notification: { id, type, header, content } }: { notification: Notification }): JSX.Element =>
    <Message
      // id={id}
      icon={typeIcon(type)}
      success={type === 'success'}
      warning={type === 'warning'}
      error={type === 'error'}
      header={header}
      content={content}
      onDismiss={() => setNotifications(notifications =>
        notifications.filter(notification => id != notification.id))}
    />

  const notificationsList = useMemo(() => notifications.map(notification =>
    <CSSTransition
      unmountOnExit
      key={notification.id}
      timeout={500}
      className='notification'
    >
      <NotificationMessage notification={notification} />
    </CSSTransition>
  ), [notifications])

  return <TransitionGroup className='notifications'>
    {notificationsList}
  </TransitionGroup>
}

export default Notifications