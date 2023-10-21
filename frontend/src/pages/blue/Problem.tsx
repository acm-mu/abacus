import MDEditor from '@uiw/react-md-editor'
import type { IProblem, ISubmission } from 'abacus'
import { ProblemRepository, SubmissionRepository } from 'api'
import { Block, ClarificationModal, Countdown, NotFound, PageLoading, Unauthorized } from 'components'
import { AppContext } from 'context'
import './Problem.scss'
import config from 'environment'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Button, Divider } from 'semantic-ui-react'
import { userHome } from 'utils'

const Problem = (): React.JSX.Element => {
  const problemRepository = new ProblemRepository()
  const submissionRepository = new SubmissionRepository()

  const { user, settings } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<IProblem>()
  const { pid } = useParams<{ pid: string }>()

  const [submissions, setSubmissions] = useState<ISubmission[]>()
  const latestSubmission = useMemo(() => {
    if (!submissions?.length || !user) return <></>
    const { sid } = submissions[submissions.length - 1]
    return (
      <p>
        <b>Last Submission:</b> <Link to={`${userHome(user)}/submissions/${sid}`}>{sid.substring(0, 7)}</Link>
      </p>
    )
  }, [submissions])

  const [isMounted, setMounted] = useState(true)

  usePageTitle(`Abacus | ${problem?.name ?? ""}`)

  useEffect(() => {
    loadProblem()
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {
    const problemResponse = await problemRepository.getMany({ filterBy: { division: 'blue', id: pid } })

    if (!isMounted) return

    if (problemResponse.ok) {
      setProblem(problemResponse.data[0])

      const submissionResponse = await submissionRepository.getMany({
        filterBy: {
          teamId: user?.uid,
          pid: problem?.pid
        }
      })

      if (!isMounted) return

      if (submissionResponse.ok) {
        setSubmissions(submissionResponse.data)
      }
    }

    setLoading(false)
  }

  if (!settings || new Date() < settings.start_date)
    if (user?.division != 'blue' && user?.role != 'admin') return <Unauthorized />

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return (
    <>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/problems" content="Problems" />
          <Breadcrumb.Divider />
          <Breadcrumb.Section active content={problem.name} />
        </Breadcrumb>
      </Block>
      <Block size="xs-9" className="problem">
        <h1>
          Problem {problem.id}: {problem.name}
        </h1>
        <Divider />
        <MDEditor.Markdown source={problem.description || ''} />
      </Block>
      <Block size="xs-3" className="problem-panel">
        {settings && new Date() < settings?.end_date ? (
          <>
            <Button
              disabled={
                submissions?.filter(({ status, released }) => status == 'accepted' || status == 'pending' || !released)
                  .length !== 0
              }
              as={Link}
              to={`/blue/problems/${problem?.id}/submit`}
              content="Submit"
              icon="upload"
              labelPosition="left"
            />
            <ClarificationModal
              title={`${problem.name} | `}
              context={{ type: 'pid', id: problem.pid }}
              trigger={<Button content="Ask" icon="question" labelPosition="left" />}
            />
            <a target="_blank" rel="noreferrer" href={`${config.API_URL}/sample_files?pid=${problem.pid}`}>
              <Button labelPosition="left" content="Skeletons" icon="download" />
            </a>
          </>
        ) : (
          <a target="_blank" rel="noreferrer" href={`${config.API_URL}/sample_files?pid=${problem.pid}`}>
            <Button labelPosition="left" content="Skeletons" icon="download" />
          </a>
        )}
        {latestSubmission}
        <Divider />
        <p>
          <b>Problem ID:</b> {problem.id}
        </p>
        {problem.cpu_time_limit ? (
          <p>
            <b>CPU Time limit:</b> {problem.cpu_time_limit}
          </p>
        ) : (
          <></>
        )}
        {problem.memory_limit ? (
          <p>
            <b>Memory limit:</b> {problem.memory_limit}
          </p>
        ) : (
          <></>
        )}
      </Block>
    </>
  )
}

export default Problem
