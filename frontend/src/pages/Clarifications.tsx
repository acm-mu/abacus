import React, { useContext } from 'react';
import AppContext from '../AppContext';
import { Unauthorized } from '../components';

const Clarifications = (): JSX.Element => {
  const { user } = useContext(AppContext);

  if (!user) return <Unauthorized />
  return <> </>
}

export default Clarifications