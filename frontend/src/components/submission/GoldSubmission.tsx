import React, { useContext } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Block, ScratchViewer } from 'components';
import SubmissionContext from './SubmissionContext';
import SubmissionDetail from './SubmissionDetail';
import "./Submission.scss"

const GoldSubmission = (): JSX.Element => {
  const { submission } = useContext(SubmissionContext)
  return <>
    <SubmissionDetail />
    {submission?.project_id ?
      <Block center transparent size='xs-12'>
        <ScratchViewer project_id={`${submission.project_id}`} />
      </Block> : <></>
    }
    {submission?.design_document ?
      <Block size='xs-12'>
        <h2>Design Document</h2>
        <MDEditor.Markdown source={submission?.design_document || ''} />
      </Block> : <></>}
  </>
}
export default GoldSubmission