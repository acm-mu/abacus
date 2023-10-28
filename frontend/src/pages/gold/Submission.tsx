import { Submission as SubmissionType } from 'abacus'
import { Block, Countdown, NotFound, PageLoading, SubmissionView, Unauthorized } from 'components'
import { AppContext } from 'context'
import config from 'environment'
import { useIsMounted, usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Gold Submission")
  const isMounted = useIsMounted()

  const { sid } = useParams<{ sid: string }>()
  const { user } = useContext(AppContext)
  const [submission, setSubmission] = useState<SubmissionType>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmission()
  }, [sid])

  const loadSubmission = async () => {
    const response = await fetch(`${config.API_URL}/submissions?sid=${sid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted()) return

    if (response.ok) {
      setSubmission(Object.values(await response.json())[0] as SubmissionType)
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />
  if (user?.division != 'gold' && user?.role != 'admin') return <Unauthorized />

  return (
    <>
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
  )
}

export default Submission
