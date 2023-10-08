import React, {useEffect} from 'react'

const Unauthorized = (): React.JSX.Element => {

  useEffect(() => {
    document.title = "Abacus | Unauthorized"
  }, [])

  return <div>
    <h1>Error 401 - Unauthorized</h1>
    <p>You do not have permission to access this page!</p>
  </div>
}

export default Unauthorized
