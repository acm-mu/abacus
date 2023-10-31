import MDEditor from '@uiw/react-md-editor'
import { Block, ScratchViewer } from 'components'
import React, { useContext } from 'react'
import { GoldSubmissionContext } from "."
import GoldFeedback from "./GoldFeedback"
import GoldSubmissionDetail from "./GoldSubmissionDetail"
import '../Submission.scss'

const GoldSubmission = (): React.JSX.Element => {
  const { submission } = useContext(GoldSubmissionContext)

  return (
    <>
      <GoldSubmissionDetail />
      {submission?.project_id &&
        <Block center transparent size="xs-12">
          <ScratchViewer project_id={`${submission.project_id}`} content={<GoldFeedback />} />
        </Block>}
      {submission?.design_document &&
        <Block size="xs-12">
          <h2>Design Document</h2>
          <MDEditor.Markdown source={submission?.design_document || ''} />
        </Block>}
    </>
  )
}
export default GoldSubmission
