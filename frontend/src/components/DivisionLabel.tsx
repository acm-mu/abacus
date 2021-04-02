import React from 'react';
import { Label } from 'semantic-ui-react';

interface DivisionLabelProps {
  division?: string
}

const DivisionLabel = ({ division }: DivisionLabelProps): JSX.Element => {
  switch (division) {
    case 'gold': return <Label className='gold' color='yellow' content="Gold" />
    case 'blue': return <Label className='blue' color='blue' content="Blue" />
    case 'public': return <Label className='public' content="Public" />
    default: return <></>
  }
}
export default DivisionLabel