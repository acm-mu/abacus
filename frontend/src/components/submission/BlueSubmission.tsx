import React, { useContext, useState, MouseEvent } from 'react';
import SubmissionContext from './SubmissionContext';
import SubmissionDetail from './SubmissionDetail';
import { Label, Menu, MenuItemProps } from 'semantic-ui-react';
import { Block } from 'components';
import SubmissionSource from './SubmissionSource';
import SubmissionTestOutput from './SubmissionTestOutput';
import "./Submission.scss"
import AppContext from 'AppContext';

const BlueSubmission = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const { submission } = useContext(SubmissionContext)

  const [activeItem, setActiveItem] = useState('source-code')
  const handleItemClick = (_event: MouseEvent, { tab }: MenuItemProps) => setActiveItem(tab)

  if (!submission) return <></>

  if (user?.role == 'team') {

    return <>
      <SubmissionDetail />
      <Block size='xs-12'>
        <SubmissionSource />
      </Block>
    </>
  }

  return <>
    <SubmissionDetail />
    <Menu attached='top' tabular>
      <Menu.Item name='Source Code' tab='source-code' active={activeItem === 'source-code'} onClick={handleItemClick} />

      {submission.status !== "pending" ?
        <Menu.Item name='Test Run Result' tab='test-cases' active={activeItem === 'test-cases'} onClick={handleItemClick} /> :
        <Menu.Item><Label>Test Run Pending...</Label></Menu.Item>}
    </Menu>

    <Block size="xs-12" menuAttached="top">
      {activeItem == 'source-code' ? <SubmissionSource /> :
        activeItem == 'test-cases' ? <SubmissionTestOutput /> : <></>}
    </Block>
  </>
}
export default BlueSubmission