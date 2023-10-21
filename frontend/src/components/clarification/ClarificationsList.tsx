import { ClarificationContext } from 'context'
import React, { useContext } from "react"
import { Grid, Segment } from "semantic-ui-react"
import ClarificationsMenu from "./ClarificationMenu"
import ClarificationView from "./ClarificationView"

const ClarificationsList = (): React.JSX.Element => {

  const { clarifications } = useContext(ClarificationContext)

  const hasClarifications = clarifications && Object.values(clarifications).length > 0

  if (!hasClarifications) {
    return <p>There are no active clarifications right now!</p>
  }

  return <Segment>
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column width={4}>
          <ClarificationsMenu />
        </Grid.Column>
        <Grid.Column width={12}>
          <ClarificationView/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>

}

export default ClarificationsList