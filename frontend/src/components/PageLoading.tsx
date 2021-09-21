import React from 'react';
import { Helmet } from 'react-helmet';
import { Loader } from 'semantic-ui-react';

const PageLoading = (): JSX.Element => <>
  <Helmet><title>Abacus | Loading... </title></Helmet>
  <Loader active inline='centered' content="Loading..." />
</>

export default PageLoading