import type { Notification, Settings, User } from 'abacus'
import { AuthService, ContestService } from 'api'
import { Footer, Notifications } from 'components'
import { AppContext, AppContextType, SocketContext } from 'context'
import config from 'environment'
import { Admin, Blue, Eagle, Gold, Index, Judge, Proctor } from 'pages'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import './App.scss'

const App = (): React.JSX.Element => {
  const contestService = new ContestService()
  const authService = new AuthService()

  const [user, setUser] = useState<User>()
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)

  const error_id = uuidv4()

  const socket = io(config.API_URL, { transports: ['websocket'] })

  const loadApp = async () => {
    try {
      const authResponse = await authService.checkAuth()
      if (authResponse.ok) {
        setUser(authResponse.data)
      }

      const settingsResponse = await contestService.getSettings()
      if (settingsResponse.ok) {
        setSettings(settingsResponse.data)
      }
    } catch (err) {
      setTimeout(() => loadApp(), 15 * 1000)
    }
  }

  useEffect(() => {
    loadApp().then(() => setLoading(false))

    const pingInterval = setInterval(async () => {
    try {
      await fetch(config.API_URL)
    } catch (err) {
      const notification: Notification = {
          id: error_id,
        type: 'error',
        header: 'Uh oh!',
        content: 'We are having issues communicating with our servers. Trying again in 15 seconds'
      }
      if (window.sendNotification) window.sendNotification(notification)
      else window.notifications = [notification]

      loadApp()
    }
    }, 15 * 1000)

    return () => {
      clearInterval(pingInterval)
    }
  }, [])

  const appContext: AppContextType = {
    user,
    setUser,
    settings
  }

  if (isLoading) return <></>

  return (
    <AppContext.Provider value={appContext}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Notifications />
          <Routes>
            <Route path="admin/*" element={<Admin />} />
            <Route path="blue/*" element={<Blue />} />
            <Route path="gold/*" element={<Gold />} />
            <Route path="judge/*" element={<Judge />} />
            <Route path="eagle/*" element={<Eagle />} />
            <Route path="proctor/*" element={<Proctor />} />
            <Route path="/*" element={<Index />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </SocketContext.Provider>
    </AppContext.Provider>
  )
}

export default App
