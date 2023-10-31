import type { IGoldSubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { Block, Countdown, NotFound, PageLoading, SubmissionView, Unauthorized } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Gold Submission")

  const submissionRepo = new SubmissionRepository()

  const { sid } = useParams<{ sid: string }>()
  const { user } = useContext(AppContext)
  const [submission, setSubmission] = useState<IGoldSubmission>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmission().catch(console.error)
  }, [])

  const loadSubmission = async () => {
    if (!sid) {
      setLoading(false)
      return
    }

    const response = await submissionRepo.get(sid)

    if (response.ok) {
      setSubmission(response.data as IGoldSubmission)
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />
  if (user?.division != 'gold' && user?.role != 'admin') return <Unauthorized />

  return <>
    <Countdown />
    <Block transparent size="xs-12">
      <Breadcrumb>
        <Breadcrumb.Section as={Link} to="/gold/submissions" content="Submissions" />
        <Breadcrumb.Divider />
        <Breadcrumb.Section active content={submission.sid.substring(0, 7)} />
      </Breadcrumb>
    </Block>
    <SubmissionView submission={submission} />
  </>
}

export default Submission
