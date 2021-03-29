import React from 'react';
import { Message } from 'semantic-ui-react';

export type StatusMessageType = {
  type: 'error' | 'warning' | 'success' | undefined
  message: string
  icon?: string
  header?: string
}

interface StatusMessageProps {
  message: StatusMessageType
  onDismiss?: () => void;
}

const StatusMessage = ({ message: { type, message, icon, header }, onDismiss }: StatusMessageProps): JSX.Element => {
  switch (type) {
    case 'success': return <Message success icon='check' header='Success!' content={message} onDismiss={onDismiss} />
    case 'error': return <Message error icon='exclamation' header='An error has occurred!' content={message} onDismiss={onDismiss} />
    case 'warning': return <Message warning icon='warning sign' header='Warning!' content={message} onDismiss={onDismiss} />
    default: return <Message icon={icon} header={header} content={message} onDismiss={onDismiss} />
  }
}

export default StatusMessage