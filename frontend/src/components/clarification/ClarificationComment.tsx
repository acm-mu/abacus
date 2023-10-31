import type { IClarification } from "abacus"
import { ClarificationRepository } from 'api'
import { AppContext } from 'context'
import React, { useContext } from "react"
import Moment from "react-moment"
import { Comment } from "semantic-ui-react"
import { ClarificationContext } from "."

const ClarificationComment = ({ clarification }: { clarification: IClarification }): React.JSX.Element => {
  const { reloadClarifications } = useContext(ClarificationContext)
  const clarificationRepo = new ClarificationRepository()
  const { user } = useContext(AppContext)

  // Admins can delete any clarification, Judge's can delete their own
  const canDelete = user?.role == 'admin' || (user?.role == 'judge' && clarification.user.uid == user?.uid)

  const deleteClarification = async () => {
    const response = await clarificationRepo.delete(clarification.cid)

    if (response.ok) {
      await reloadClarifications()
    }
  }

  return <Comment>
    <Comment.Content>
      <Comment.Author as="a">{clarification.user.display_name}</Comment.Author>
      <Comment.Metadata>
        <div>
          <Moment fromNow date={clarification.date * 1000} />
        </div>
        {canDelete && <a href="#" onClick={deleteClarification}>Delete</a>}
      </Comment.Metadata>
      <Comment.Text>{clarification.body}</Comment.Text>
    </Comment.Content>
  </Comment>
}

export default ClarificationComment