import type { IClarification } from "abacus"
import React, { useState } from "react"
import { Checkbox, Menu } from "semantic-ui-react"
import ClarificationMenuItem from "./ClarificationMenuItem"

const ClarificationsMenu = ({ clarifications }: { clarifications: IClarification[] }): React.JSX.Element => {
  const [showClosed, setShowClosed] = useState(false)

  return <>
    <Checkbox toggle label="Show Closed"
              onChange={(_, { checked }) => setShowClosed(checked || false)}
              checked={showClosed} />
    <Menu secondary vertical style={{ width: '100%' }}>
      {clarifications.filter((c1) => showClosed || c1.open)
        .sort((c1, c2) => c2.date - c1.date)
        .map((c) => <ClarificationMenuItem key={`clarification-item-${c.cid}`} clarification={c} />)}
    </Menu>
  </>
}

export default ClarificationsMenu