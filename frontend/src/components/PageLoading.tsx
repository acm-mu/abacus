import React from 'react'
import {Loader} from 'semantic-ui-react'
import {usePageTitle} from 'hooks'

const PageLoading = (): React.JSX.Element => {
  usePageTitle("Abacus | Loading... ")

  return <Loader active inline="centered" content="Loading..."/>
}

export default PageLoading
