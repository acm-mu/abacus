import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import { Index, Admin, Blue, Gold } from 'pages'
import AppContext, { AppContextType } from 'AppContext';
import config from 'environment'
import { Footer, Notifications } from 'components';
import './App.scss';

const App = (): JSX.Element => {
  const [user, setUser] = useState()
  const [settings, setSettings] = useState()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [socket, setSocket] = useState<SocketIOClient.Socket>()

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

  const loadApp = async () => {
    try {
      await loadSettings()
      await checkAuth()
      setSocket(io(config.API_URL))
    } catch (err) {
      setError(err)
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
    socket,
    settings
  }

  if (isLoading) return <></>

  return <AppContext.Provider value={appContext}>
    <Notifications />
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
