import type { Clarification } from "abacus"
import { AppContext, ClarificationContext } from 'context'
import config from 'environment'
import React, { useContext } from "react"
import Moment from "react-moment"
import { Comment } from "semantic-ui-react"

const ClarificationComment = ({ clarification }: { clarification: Clarification }) => {
  const { user } = useContext(AppContext)
  const { reloadClarifications } = useContext(ClarificationContext)

  // Admins can delete any clarification, Judge's can delete their own
  const canDelete = user?.role == 'admin' || (user?.role == 'judge' && clarification.user.uid == user?.uid)

  const deleteClarification = async () => {
    const response = await fetch(`${config.API_URL}/clarifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({ cid: clarification.cid })
    })

    if (response.ok) {
      reloadClarifications()
    }
  }

  return (
    <Comment>
      <Comment.Content>
        <Comment.Author as="a">{clarification.user.display_name}</Comment.Author>
        <Comment.Metadata>
          <div>
            <Moment fromNow date={clarification.date * 1000} />
          </div>
          {canDelete && (
            <a href="#" onClick={deleteClarification}>
              Delete
            </a>
          )}
        </Comment.Metadata>
        <Comment.Text>{clarification.body}</Comment.Text>
      </Comment.Content>
    </Comment>
  )
}

export default ClarificationComment