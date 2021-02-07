import React, { useState } from "react";

import { Footer } from "./components";
import "./App.scss";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Admin from "./pages/admin/";
import Blue from './pages/blue/';
import Gold from './pages/gold/'
import Index from './pages'
import { SocketContext, socket } from './context/socket'
import { UserContext, reloadFromLocalStorage, saveToLocalStorage } from "./context/user";
import { UserType } from "./types";

const App = (): JSX.Element => {
  const [user, setUser] = useState<UserType | undefined>(reloadFromLocalStorage)

  const value = {
    user, setUser: (user: UserType | undefined) => {
      saveToLocalStorage(user)
      setUser(user)
    }
  }

  return (
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={value}>
        <Router>
          <Switch>
            <Route path='/admin' component={Admin} />
            <Route path="/blue" component={Blue} />
            <Route path="/gold" component={Gold} />
            <Route path="/" component={Index} />
          </Switch>
        </Router>
        <Footer />
      </UserContext.Provider>
    </SocketContext.Provider >
  )
}

export default App;
