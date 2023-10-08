import React from 'react'
import {usePageTitle} from 'hooks'

const Unauthorized = (): React.JSX.Element => {
  usePageTitle("Abacus | Unauthorized")

  return <div>
    <h1>Error 401 - Unauthorized</h1>
    <p>You do not have permission to access this page!</p>
  </div>
}

export default Unauthorized
