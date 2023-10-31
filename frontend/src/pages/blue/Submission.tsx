import type { ISubmission } from 'abacus'
import { SubmissionRepository } from 'api'
import { Block, Countdown, NotFound, PageLoading, SubmissionView, Unauthorized } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'

const Submission = (): React.JSX.Element => {
  usePageTitle("Abacus | Blue Submission")

  const { sid } = useParams<{ sid: string }>()
  const { user } = useContext(AppContext)
  const [submission, setSubmission] = useState<ISubmission>()
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmission().catch(console.error)
    return () => {
      setMounted(false)
    }
  }, [])

  const loadSubmission = async () => {
    if(!sid) {
      console.error("Cannot load submission because sid is not defined!")
      return
    }
    const submissions = new SubmissionRepository()
    const response = await submissions.get(sid)

    if (!isMounted) return

    if (response.ok) {
      setSubmission(response.data)
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (!submission) return <NotFound />
  if (user?.division != 'blue' && user?.role != 'admin') return <Unauthorized />

  return (
    <>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/submissions" content="Submissions" />
          <Breadcrumb.Divider />
          <Breadcrumb.Section active content={submission.sid.substring(0, 7)} />
        </Breadcrumb>
      </Block>

      <SubmissionView submission={submission} />
    </>
  )
}

export default Submission
