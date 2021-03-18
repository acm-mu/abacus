import React from 'react';
import { useParams } from 'react-router';

const Clarification = (): JSX.Element => {
  const { cid } = useParams<{ cid: string }>()

  return <><h1>Clarification {cid}</h1></>
}

export default Clarification