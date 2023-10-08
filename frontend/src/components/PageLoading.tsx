import React, {useEffect} from 'react'
import {Loader} from 'semantic-ui-react'

const PageLoading = (): React.JSX.Element => {

  useEffect(() => {
    document.title = "Abacus | Loading... "
  }, [])

  return <Loader active inline="centered" content="Loading..."/>
}

export default PageLoading
