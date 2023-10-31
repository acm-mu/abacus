import { Block } from 'components/index'
import { AppContext } from 'context'
import React, { MouseEvent, useContext, useState } from 'react'
import { Label, Menu, MenuItemProps } from 'semantic-ui-react'
import BlueSubmissionDetail from "./BlueSubmissionDetail"
import BlueSubmissionContext from "./context"
import SubmissionSource from './SubmissionSource'
import SubmissionTestOutput from './SubmissionTestOutput'
import '../Submission.scss'

const BlueSubmission = (): React.JSX.Element => {
  const { user } = useContext(AppContext)
  const { submission } = useContext(BlueSubmissionContext)

  const [activeItem, setActiveItem] = useState('source-code')
  const handleItemClick = (_event: MouseEvent, { tab }: MenuItemProps) => setActiveItem(tab)

  if (!submission) return <></>

  if (user?.role == 'team') {
    return (
      <>
        <BlueSubmissionDetail />
        <Block size="xs-12">
          <SubmissionSource />
        </Block>
      </>
    )
  }

  return <>
    <BlueSubmissionDetail />
    <Menu attached="top" tabular>
      <Menu.Item
        name="Source Code"
        tab="source-code"
        active={activeItem === 'source-code'}
        onClick={handleItemClick}
      />

      {submission.status !== 'pending' ? (
        <Menu.Item
          name="Test Run Result"
          tab="test-cases"
          active={activeItem === 'test-cases'}
          onClick={handleItemClick}
        />
      ) : (
        <Menu.Item>
          <Label>Test Run Pending...</Label>
        </Menu.Item>
      )}
    </Menu>

    <Block size="xs-12" menuAttached="top">
      {activeItem == 'source-code' ? (
        <SubmissionSource />
      ) : activeItem == 'test-cases' ? (
        <SubmissionTestOutput />
      ) : (
        <></>
      )}
    </Block>
  </>
}
export default BlueSubmission
