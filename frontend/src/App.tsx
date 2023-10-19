import { User, Notification } from 'abacus'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Index, Admin, Blue, Gold, Judge, Eagle, Proctor } from 'pages'
import config from 'environment'
import { Footer, Notifications } from 'components'
import { v4 as uuidv4 } from 'uuid'
import { AppContext, AppContextType, SocketContext } from 'context'
import io from 'socket.io-client'
import './App.scss'

const App = (): React.JSX.Element => {
  const [user, setUser] = useState<User>()
  const [settings, setSettings] = useState()
  const [isLoading, setLoading] = useState(true)

  const error_id = uuidv4()

  const socket = io(config.API_URL, { transports: ['websocket'] })

  const checkAuth = async () => {
    try {
      const response = await fetch(`${config.API_URL}/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (response.ok) {
        setUser(await response.json())
      }
      return true
    } catch (err) {
      return false
    }
  }

  const loadSettings = async (): Promise<boolean> => {
    const response = await fetch(`${config.API_URL}/contest`)
    if (response.ok) {
      const data = await response.json()

      setSettings({
        ...data,
        start_date: new Date(parseInt(data.start_date) * 1000),
        end_date: new Date(parseInt(data.end_date) * 1000),
        practice_start_date: new Date(parseInt(data.practice_start_date) * 1000),
        practice_end_date: new Date(parseInt(data.practice_end_date) * 1000)
      })
      return true
    }
    return false
  }

  const loadApp = async () => {
    try {
      await loadSettings()
      await checkAuth()
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
