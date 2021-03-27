import React, { useContext } from 'react'
import AppContext from 'AppContext';
import { Block, Countdown } from 'components'
import { Helmet } from 'react-helmet';

const Standings = (): JSX.Element => {
  const { settings } = useContext(AppContext);

  if (!settings || new Date() < settings.start_date) {
    return <>
      <Helmet>
        <title>Abacus | Gold Standings</title>
      </Helmet>
      <Countdown />
      <Block center size='xs-12'>
        <h1>Competition not yet started!</h1>
        <p>Standings will become available when the competition begins, and submissions start rolling in.</p>
      </Block>
    </>
  }
  return <> </>
}

export default Standings