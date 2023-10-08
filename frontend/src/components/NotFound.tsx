import React, {useEffect} from 'react'
import notfound from 'assets/404.png'

const NotFound = (): React.JSX.Element => {

  useEffect(() => {
    document.title = "Abacus | Not Found"
  }, [])

  return <img src={notfound} width="100%" height="auto" alt="404 Not Found"/>
}

export default NotFound
