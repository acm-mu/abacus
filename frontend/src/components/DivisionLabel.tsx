import React from 'react';
import { Label } from 'semantic-ui-react';

interface DivisionLabelProps {
  division?: string
}

const DivisionLabel = ({ division }: DivisionLabelProps): JSX.Element => {
  switch (division) {
    case 'gold': return <Label color='yellow' content="Gold" />
    case 'blue': return <Label color='blue' content="Blue" />
    case 'public': return <Label content="Public" />
    default: return <Label content="" />
  }
}
export default DivisionLabel