import React from 'react'
import notfound from 'assets/404.png'
import {usePageTitle} from 'hooks'

const NotFound = (): React.JSX.Element => {
  usePageTitle("Abacus | Not Found")

  return <img src={notfound} width="100%" height="auto" alt="404 Not Found"/>
}

export default NotFound
