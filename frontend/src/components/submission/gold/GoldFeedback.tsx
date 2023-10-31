import type { IGoldSubmission } from "abacus"
import { SubmissionRepository } from "api"
import { AppContext } from "context"
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Form, Header, Rating, RatingProps, Segment, TextArea } from "semantic-ui-react"
import { userHome } from "utils"
import { GoldSubmissionContext } from "."

const GoldFeedback = (): React.JSX.Element => {
  const submissionRepository = new SubmissionRepository()
  const { user } = useContext(AppContext)
  const { submission, setSubmission } = useContext(GoldSubmissionContext)
  const [submissions, setSubmissions] = useState<IGoldSubmission[]>()

  useEffect(() => {
    loadSubmission().catch(console.error)
  }, [submission])

  const loadSubmission = async () => {
    const response = await submissionRepository.getMany({
      filterBy: {
        teamId: submission?.tid,
        problemId: submission?.pid
      }
    })
    if (response.ok) {
      setSubmissions(Object.values(response.data?.items as { [key: string]: IGoldSubmission }))
    }
  }

  const handleScore = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, { rating: score }: RatingProps) => {
    if (!submission || !setSubmission) return
    if (score && typeof score == 'number') setSubmission({ ...submission, score })
  }

  const handleChange = ({ target: { value: feedback } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!submission || !setSubmission) return
    setSubmission({ ...submission, feedback })
  }

  if (!submission?.released) {
    if (user?.role != 'judge' && user?.role != 'admin') {
      return (
        <Segment placeholder style={{ alignItems: 'center' }}>
          <Header size="huge">Pending Judgement!</Header>
        </Segment>
      )
    }
  }

  return <>
    <Segment>
      <Form>
        <h2>Scorecard</h2>

        <div className="field">
          <label>Score</label>
          <Rating
            icon="star"
            disabled={!setSubmission}
            rating={submission?.score}
            maxRating={submission?.problem.max_points || 5}
            size="massive"
            onRate={handleScore}
          />
        </div>

        {setSubmission ? (
          <Form.Field label="Feedback" control={TextArea} value={submission?.feedback} onChange={handleChange} />
        ) : (
          <>
            <label>Feedback</label>
            <p>{submission?.feedback}</p>
          </>
        )}
      </Form>
    </Segment>
    {user && submissions?.length ? (
      <Segment>
        <h3>Team&apos;s Other Submissions</h3>
        <ul>
          {submissions
            .filter((sub: { sid: string }) => sub.sid != submission?.sid)
            .map((sub: { sid: string }) => (
              <li key={sub.sid}>
                <Link to={`${userHome(user)}/submissions/${sub.sid}`}>{sub.sid}</Link>
              </li>
            ))}
        </ul>
      </Segment>
    ) : (
      <></>
    )}
  </>
}

export default GoldFeedback