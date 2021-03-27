import { Notification, User } from 'abacus';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import { Index, Admin, Blue, Gold } from 'pages'
import AppContext, { AppContextType } from 'AppContext';
import config from 'environment'
import { Footer, Notifications } from 'components';
import { v4 as uuidv4 } from 'uuid';
import './App.scss';

const App = (): JSX.Element => {
  const [user, setUser] = useState<User>()
  const [settings, setSettings] = useState()
  const [isLoading, setLoading] = useState(true)
  const [socket, setSocket] = useState<SocketIOClient.Socket>()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${config.API_URL}/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (response.ok) {
        setUser(await response.json())
      }
      return true
    } catch (err) { return false }
  }

  const loadSettings = async (): Promise<boolean> => {
    const response = await fetch(`${config.API_URL}/contest`)
    if (response.ok) {
      const data = await response.json()

      setSettings({
        ...data,
        start_date: new Date(parseInt(data.start_date) * 1000),
        end_date: new Date(parseInt(data.end_date) * 1000)
      })
      return true
    }
    return false
  }

  const sendNotification = (notification: Notification) =>
    setNotifications(notifications =>
      notifications.concat(notification))

  const loadApp = async () => {
    try {
      await loadSettings()
      await checkAuth()
      setSocket(io(config.API_URL))
    } catch (err) {
      sendNotification({ id: uuidv4(), type: 'error', header: 'Uh oh!', content: "We are having issues communicating with our servers." })
    }
  }

  useEffect(() => {
    loadApp().then(() => {
      setLoading(false)
    })
  }, [])

  const appContext: AppContextType = {
    user,
    setUser,
    sendNotification,
    socket,
    settings
  }

  if (isLoading) return <></>

  return <AppContext.Provider value={appContext}>
    <Notifications notifications={notifications} setNotifications={setNotifications} />
    <Router>
      <Switch>
        <Route path='/admin' component={Admin} />
        <Route path='/blue' component={Blue} />
        <Route path='/gold' component={Gold} />
        <Route path='/' component={Index} />
      </Switch>
    </Router>
    <Footer />
  </AppContext.Provider>
}

export default App;
